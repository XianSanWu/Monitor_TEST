import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  CellDoubleClickedEvent,
  ColDef,
  GridApi,
  ICellRendererParams,
} from 'ag-grid-community';
import { catchError, finalize, takeUntil, tap } from 'rxjs';
import { CustomFilterComponent } from '../../../component/ag-grid/custom-filter/custom-filter.component';
import { CollapsibleSectionComponent } from '../../../component/form/collapsible-section/collapsible-section.component';
import { DropdownComponent } from '../../../component/form/dropdown/dropdown.component';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { SmartAuditDirective } from '../../../core/directivies/smart-audit-directive';
import { AuditNameEnum } from '../../../core/enums/audit-name-enum';
import { LogicOperatorEnum } from '../../../core/enums/logic-operator-enum';
import { MathSymbolEnum } from '../../../core/enums/math-symbol-enum';
import { PermissionActionEnum } from '../../../core/enums/permission-enum';
import { Option, PageBase } from '../../../core/models/common/base.model';
import {
  UserRequest,
  UserUpdateRequest,
} from '../../../core/models/requests/user-model';
import { AuditActionService } from '../../../core/services/audit-action.service';
import { ConfigService } from '../../../core/services/config.service';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { BaseComponent } from '../../base.component';
import { PermissionManageService } from '../permission-manage.service';

@Component({
  selector: 'permission-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AgGridModule,
    DropdownComponent,
    LoadingIndicatorComponent,
    MatCheckboxModule,
    MatButtonModule,
    CollapsibleSectionComponent,
    SmartAuditDirective,
  ],
  providers: [PermissionManageService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export default class MainComponent extends BaseComponent implements OnInit {
  validateForm: FormGroup;
  // 假資料
  selectList = {
    options: [
      { id: true, name: '已啟用' },
      { id: false, name: '已停用' },
    ],
    key: 'id',
    val: 'name',
  };

  constructor(
    // private dialog: MatDialog,
    private dialogService: DialogService,
    private permissionManageService: PermissionManageService,
    private configService: ConfigService,
    private loadingService: LoadingService,
    private router: Router,
    private auditSvc: AuditActionService
  ) {
    super();
    this.validateForm = new FormGroup({
      isUse: new FormControl(true, [Validators.required]),
    });

    // if (this.auditSvc.get() === null) {
    this.auditSvc.set(AuditNameEnum.Permission.Main);
    // }
  }

  ngOnInit(): void {}

  onValueChange(value: any) {
    // console.log('Selected Value:', value);
    this.loadData();
  }

  onSettings() {
    this.router.navigate(['/permission/permission_settings']);
  }

  onDetail() {
    this.router.navigate([
      '/permission/permission_detail',
      PermissionActionEnum.Create,
    ]);
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
      filter: false,
      sortable: false,
      width: 60,
    },
    {
      headerName: '帳號',
      field: 'UserName',
      maxWidth: 170,
      // cellClass: 'centered-cell',
      // headerClass: 'centered-header',
    },
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
    {
      headerName: '更新時間',
      field: 'UpdateAt',
      maxWidth: 170,
      cellRenderer: (params: ICellRendererParams) => {
        const rawValue = params.value || '';
        if (rawValue === '0001-01-01 00:00:00') {
          return '';
        }

        return rawValue;
      },
    },
    {
      headerName: '功能',
      field: 'Function',
      flex: 1, // 讓這欄自動填滿剩餘空間
      minWidth: 600,
      cellClass: 'centered-cell',
      headerClass: 'centered-header',
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams) => {
        const userName = params.data.UserName ?? '';
        const userUuid = params.data.Uuid ?? '';
        const isUse = this.validateForm.get('isUse')?.value;
        const isActive = params.data.IsUse;

        // 創建容器
        const container = document.createElement('div');
        container.className = 'd-flex gap-1 flex-wrap';

        // 查看權限按鈕
        const viewBtn = document.createElement('button');
        viewBtn.className = 'btn btn-secondary btn-sm text-white';
        viewBtn.innerHTML = `<i class="bi bi-eye"></i> 查看權限`;
        viewBtn.addEventListener('click', () => {
          // 轉址查看權限
          this.router.navigate([
            '/permission/permission_detail',
            PermissionActionEnum.Read,
            userName,
            userUuid,
            isUse,
          ]);
        });
        container.appendChild(viewBtn);

        // 修改權限按鈕
        if (isUse) {
          const editBtn = document.createElement('button');
          editBtn.className = 'btn btn-warning btn-sm';
          editBtn.innerHTML = `<i class="bi bi-pencil"></i> 修改權限`;
          editBtn.addEventListener('click', () => {
            // 轉址修改權限
            this.router.navigate([
              '/permission/permission_detail',
              PermissionActionEnum.Update,
              userName,
              userUuid,
              isUse,
            ]);
          });
          container.appendChild(editBtn);
        }

        // 啟用 / 停用按鈕
        const toggleBtn = document.createElement('button');
        toggleBtn.className = isUse
          ? 'btn btn-danger btn-sm'
          : 'btn btn-primary btn-sm';
        toggleBtn.innerHTML = isUse
          ? `<i class="bi bi-trash"></i> 停用帳號`
          : `<i class="bi bi-person-check"></i> 啟用帳號`;
        toggleBtn.addEventListener('click', () => {
          const reqData: UserUpdateRequest = {
            FieldRequest: {
              IsUse: !isActive,
            },
            ConditionRequest: [
              {
                UserName: {
                  Key: 'UserName',
                  MathSymbol: MathSymbolEnum.Equal,
                  Value: userName,
                },
                InsideLogicOperator: LogicOperatorEnum.None,
                GroupLogicOperator: LogicOperatorEnum.None,
              },
            ],
          };

          // 呼叫更新方法
          params.context.componentParent.onUserNameIsUse(reqData);
        });
        container.appendChild(toggleBtn);

        return container;
      },
    },
  ];

  onUserNameIsUse(reqData: UserUpdateRequest) {
    this.permissionManageService
      .IsUseUserAsync(reqData)
      .pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message || '執行失敗',
          });
          throw Error(err.message);
        }),
        tap((res) => {
          const isSuccess = !!res.Data && res.Data;
          this.dialogService.openCustomSnackbar({
            title: '提示訊息',
            message: `執行${isSuccess ? '成功' : '失敗'}`,
          });
        }),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadData();
          this.loadingService.hide();
        })
      )
      .subscribe();
  }

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

    // 組裝請求資料
    const reqData: UserRequest = {
      page: pageBase,
      sortModel: sortModel,
      filterModel: filterModel,
      fieldModel: this.validateForm.getRawValue(),
    };
    //#endregion

    this.permissionManageService
      .GetUserListAsync(reqData)
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
