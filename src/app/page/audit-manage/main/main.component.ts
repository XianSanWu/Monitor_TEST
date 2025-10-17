import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  CellDoubleClickedEvent,
  ColDef,
  GridApi,
  ICellRendererParams,
} from 'ag-grid-community';
import { catchError, finalize, forkJoin, of, takeUntil, tap } from 'rxjs';
import { CommonUtil } from '../../../common/utils/common-util';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { CustomFilterComponent } from '../../../component/ag-grid/custom-filter/custom-filter.component';
import { CollapsibleSectionComponent } from '../../../component/form/collapsible-section/collapsible-section.component';
import { DateRangeComponent } from '../../../component/form/date-range/date-range.component';
import { SearchMultiselectComponent } from '../../../component/form/search-multiselect/search-multiselect.component';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { AuditNameEnum } from '../../../core/enums/audit-name-enum';
import { Option, PageBase } from '../../../core/models/common/base.model';
import { AuditSearchListRequest } from '../../../core/models/requests/audit.model';
import { FieldModel } from '../../../core/models/requests/permission-model';
import { UserRequest } from '../../../core/models/requests/user-model';
import { AuditActionService } from '../../../core/services/audit-action.service';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { BaseComponent } from '../../base.component';
import { PermissionManageService } from '../../permission-manage/permission-manage.service';
import { AuditManageService } from '../audit-manage.service';

@Component({
  selector: 'audit-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    LoadingIndicatorComponent,
    // BasicInputComponent,
    SearchMultiselectComponent,
    CollapsibleSectionComponent,
    DateRangeComponent,
  ],
  providers: [PermissionManageService, AuditManageService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent extends BaseComponent implements OnInit {
  validateForm: FormGroup;
  // 資料
  auditNameList: Option[] = [];
  userNameList: Option[] = [];

  constructor(
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private permissionManageService: PermissionManageService,
    private auditManageService: AuditManageService,
    private auditSvc: AuditActionService,
    private router: Router
  ) {
    super();
    this.auditSvc.set(AuditNameEnum.Audit.Main);

    this.auditNameList = this.generateAuditNameOptions();

    this.validateForm = new FormGroup(
      {
        startDate: new FormControl(this.getOneYearAgo(), [
          Validators.required,
          ValidatorsUtil.dateFmt,
        ]),
        endDate: new FormControl(this.getToday(), [
          Validators.required,
          ValidatorsUtil.dateFmt,
        ]),
        auditName: new FormControl([], []),
        userName: new FormControl([], []),
      },
      { validators: ValidatorsUtil.dateRangeValidator }
    );
  }

  // 一年前的日期（格式: yyyy-MM-dd）
  getOneYearAgo(): string {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 1); // 一年前
    return CommonUtil.formatDate(today);
  }

  // 今天的日期（格式: yyyy-MM-dd）
  getToday(): string {
    const today = new Date();
    return CommonUtil.formatDate(today);
  }

  generateAuditNameOptions(): Option[] {
    return Object.entries(AuditNameEnum).flatMap(([group, enums]) =>
      Object.entries(enums).map(([key, value]) => ({
        key: `${group}.${key}`,
        value: value as string,
      }))
    );
  }

  getAuditNameDisplayValue(key: string): string {
    const [group, itemKey] = key.split('.');
    const groupEnum = (AuditNameEnum as any)[group];
    return groupEnum ? groupEnum[itemKey] : key;
  }

  ngOnInit(): void {
    this.loadPermissions();
    // this.Search();
  }

  loadPermissions() {
    this.loadingService.show();

    const pageBaseBig = new PageBase({
      pageSize: 2147483647,
      pageIndex: 1,
      totalCount: 0,
    });

    // 組裝請求資料
    const reqData1: UserRequest = {
      page: pageBaseBig,
      sortModel: undefined,
      filterModel: undefined,
      fieldModel: new FieldModel({ IsUse: true }),
    };

    const observables: any = {
      // 取得可已啟用帳號
      list1: this.permissionManageService.GetUserListAsync(reqData1).pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: '錯誤在API：GetUserListAsync。' + err.message,
          });
          console.error('[list1] 錯誤在API：GetUserListAsync。API error:', err);
          return of(null); // 不要 throw，讓流程繼續
        })
      ),
    };

    forkJoin(observables)
      .pipe(
        takeUntil(this.destroy$),
        tap((result: any) => {
          if (result.list1) {
            const respData1 = result.list1.Data.SearchItem;
            if (!!respData1 && respData1.length > 0) {
              this.userNameList = respData1.map(
                (f: any) => new Option({ key: f.Uuid, value: f.UserName })
              );
            }
          }
        }),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe();
  }

  // 使用 HostListener 監聽 Enter 鍵
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (this.validateForm.invalid) {
      return;
    }

    this.Search();
  }

  Search(): void {
    this.loadData();
  }

  //#region Ag-grid
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  gridApi!: GridApi;
  rowData: any[] = [];

  defaultColDef = {
    sortable: true,
    filter: CustomFilterComponent,
  };

  columnDefs: ColDef[] = [
    {
      headerName: '序號',
      valueGetter: (params) => {
        const rowIndex = params.node?.rowIndex ?? -1;
        const currentPage = params.api.paginationGetCurrentPage();
        const pageSize = params.api.paginationGetPageSize();
        return rowIndex >= 0 ? rowIndex + 1 + currentPage * pageSize : '';
      },
      width: 100,
    },
    { headerName: '使用者帳號', field: 'UserName', width: 140 },
    { headerName: 'IP位址', field: 'IpAddress', width: 150 },
    // { headerName: '使用者UuId', field: 'UserId', width: 140 },
    { headerName: '前端URL', field: 'FrontUrl', width: 200 },
    { headerName: '前端操作名稱', field: 'FrontActionName', width: 180 },
    { headerName: '後端操作名稱', field: 'BackActionName', width: 180 },
    { headerName: 'HTTP', field: 'HttpMethod', width: 120 },
    { headerName: '狀態碼', field: 'HttpStatusCode', width: 120 },
    { headerName: '請求路徑', field: 'RequestPath', width: 200 },
    { headerName: '參數', field: 'Parameters', width: 250 },
    { headerName: '回傳', field: 'ResponseBody', width: 250 },
    {
      headerName: '建立時間',
      field: 'CreateAt',
      maxWidth: 170,
      cellRenderer: (params: ICellRendererParams) => {
        const rawValue = params.value || '';
        if (rawValue === '0001-01-01 00:00:00') {
          return '';
        }

        return rawValue;
      },
    },
  ];

  //強制Ag-grid資料複製 (因複製功能為企業版才可以用)
  onCellDoubleClicked(event: CellDoubleClickedEvent) {
    const value = event.value;
    if (value !== null && value !== undefined) {
      navigator.clipboard
        .writeText(value?.toString()?.trim())
        .then(() => {
          this.dialogService.openCustomSnackbar({
            title: '提示訊息',
            message: '複製成功：' + value || '複製失敗',
          });
        })
        .catch((err) => {
          this.dialogService.openCustomSnackbar({
            title: '提示訊息',
            message: '複製失敗：' + err.message || '複製失敗',
          });
        });
    }
  }

  // 分頁相關
  pageSize = 10; // 每頁顯示筆數
  currentPage = 1; // 當前頁數
  totalPages = 1; // 總頁數
  totalCount = 0; // 總筆數
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.loadData();
  }

  //  **呼叫後端 API 載入資料**
  loadData() {
    this.loadingService.show();

    //#region 組裝請求資料
    // 取得 ag-Grid 的排序資訊
    const columnModel = this.gridApi?.getColumnState() || [];
    // console.log('columnModel', columnModel)
    const gridSortModel = columnModel?.filter((f) => f.sort)?.[0];
    let sortModel: Option | null = null;
    const sortField = gridSortModel?.colId ?? '';
    const sortOrder = gridSortModel?.sort ?? '';
    sortModel = new Option({
      key: sortField,
      value: sortOrder,
    });

    // 取得 ag-Grid 的篩選條件
    const gridFilterModel = this.gridApi?.getFilterModel() || {};
    let filterModel: Array<Option> = new Array<Option>();

    // 檢查 gridFilterModel 是否為非空物件
    if (Object.keys(gridFilterModel).length > 0) {
      // 使用 Object.entries() 來遍歷物件的鍵值對
      Object.entries(gridFilterModel).forEach(([key, f]) => {
        filterModel.push(
          new Option({
            key: key,
            value: f.value,
          })
        );
      });
    }

    // console.log('gridFilterModel', gridFilterModel)
    // console.log('filterModel', filterModel)
    const pageBase = new PageBase({
      pageSize: this.pageSize,
      pageIndex: this.currentPage,
      totalCount: this.totalCount,
    });

    const rawValue = this.validateForm.getRawValue();

    const formattedData = {
      ...rawValue,
      startDate: rawValue.startDate ? CommonUtil.formatDateTime(new Date(rawValue.startDate)) : null,
      endDate: rawValue.endDate ? CommonUtil.formatDateTime(new Date(rawValue.endDate)) : null,
      auditName: (rawValue.auditName || []).map((key: string) => this.getAuditNameDisplayValue(key)),
    };

    // 組裝請求資料
    const reqData: AuditSearchListRequest = {
      page: pageBase,
      sortModel: sortModel,
      filterModel: filterModel,
      fieldModel: formattedData,
    };
    //#endregion

    this.auditManageService
      .GetAllAudit(reqData)
      .pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message || '查詢列表失敗',
          });
          throw Error(err.message);
        }),
        tap((res) => {
          this.rowData = res.Data.SearchItem;
          this.totalCount = res.Data.Page.TotalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        }),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe();
  }

  //  **處理分頁按鈕點擊**
  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return; // 避免超過範圍
    this.currentPage = page;
    this.loadData();
  }

  //  **處理排序改變**
  onSortChanged() {
    this.currentPage = 1; // 重新排序時回到第一頁
    this.loadData();
  }

  //  **處理篩選改變**
  onFilterChanged() {
    this.currentPage = 1; // 重新篩選時回到第一頁
    this.loadData();
  }
  //#endregion
}
