import { Component, HostListener, ViewChild } from '@angular/core';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { LoadingService } from '../../../core/services/loading.service';
import { MailHunterManageService } from '../mail-hunter-manage.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { CollapsibleSectionComponent } from '../../../component/form/collapsible-section/collapsible-section.component';
import { BaseComponent } from '../../base.component';
import { DialogService } from '../../../core/services/dialog.service';
import { SearchSelectComponent } from '../../../component/form/search-select/search-select.component';
import { DateRangeComponent } from '../../../component/form/date-range/date-range.component';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { GridApi, ColDef, CellDoubleClickedEvent } from 'ag-grid-community';
import { Option, PageBase } from '../../../core/models/common/base.model';
import { Department } from '../../../core/enums/department-enum';
import { MailHunterSearchListRequest } from '../../../core/models/requests/mail-hunter.model';
import { catchError, finalize, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'project-mail-count',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DateRangeComponent,
    SearchSelectComponent,
    LoadingIndicatorComponent,
    AgGridModule,
    CollapsibleSectionComponent
  ],
  providers: [LoadingService, MailHunterManageService],
  templateUrl: './project-mail-count.component.html',
  styleUrl: './project-mail-count.component.scss'
})
export default class ProjectMailCountComponent extends BaseComponent {
  validateForm: FormGroup;
  selectedItem = '';
  departmentList: Option[] = [
    { key: Department.CDP01, value: '數金' },
    { key: Department.AT001, value: '個金' },
  ];;
  isApiFinish: boolean = true;

  constructor(
    private dialogService: DialogService,
    private mailHunterManageService: MailHunterManageService,
    private loadingService: LoadingService,
  ) {
    super();

    this.validateForm = new FormGroup({
      department: new FormControl('', [
        Validators.required,
        ValidatorsUtil.blank,
        ValidatorsUtil.checkOptionValue(this.departmentList)
      ]),
      startDate: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt]),
      endDate: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt]),
    }, { validators: ValidatorsUtil.dateRangeValidator });
  }


  // 使用 HostListener 監聽 Enter 鍵
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    this.Search();
  }

  Search(): void {
    if (!this.isApiFinish) {
      return;
    }
    this.isApiFinish = false;

    const rawValue = this.validateForm.getRawValue();
    console.log('rawValue', rawValue);

    const formattedData = {
      ...rawValue,
      startDate: rawValue.startDate ? new Date(rawValue.startDate).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) : null,
      endDate: rawValue.endDate ? new Date(rawValue.endDate).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }) : null
    };

    console.log('formattedData', formattedData);
    this.loadData(formattedData);
  }

  onItemSelected(value: string) {
    this.selectedItem = value;
    console.log('選中的值:', value);
  }

  //#region Ag-grid
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  gridApi!: GridApi;
  rowData: any[] = [];

  defaultColDef = {
    sortable: true,
    filter: false,
  };

  columnDefs: ColDef[] = [
    { headerName: '專案發送的年份', field: 'Year' },
    { headerName: '專案發送的月份', field: 'Month' },
    { headerName: '每月的專案數量', field: 'ProjectCount' },
    { headerName: '每月專案涉及的用戶總數', field: 'ProjectOriginTotalUser' }
  ];

  //強制Ag-grid資料複製 (因複製功能為企業板才可以用)
  onCellDoubleClicked(event: CellDoubleClickedEvent) {
    const value = event.value;
    if (value !== null && value !== undefined) {
      navigator.clipboard.writeText(value?.toString()?.trim())
        .then(() => {
          this.dialogService.openCustomSnackbar({ title: '提示訊息', message: '複製成功：' + value || '複製失敗' });
        })
        .catch(err => {
          this.dialogService.openCustomSnackbar({ title: '提示訊息', message: '複製失敗：' + err.message || '複製失敗' });
        });
    }
  }

  // 分頁相關
  pageSize = 10; // 每頁顯示筆數
  currentPage = 1; // 當前頁數
  totalPages = 1; // 總頁數
  totalCount = 0; // 總筆數
  // onGridReady(params: any) {
  //   this.gridApi = params.api;
  //   this.loadData();
  // }

  //  **呼叫後端 API 載入資料**
  loadData(fieldData: any) {
    //#region 組裝請求資料
    // 取得 ag-Grid 的排序資訊
    const columnModel = this.gridApi?.getColumnState() || [];
    // console.log('columnModel', columnModel)
    const gridSortModel = columnModel?.filter(f => f.sort)?.[0];
    let sortModel: Option | null = null;
    const sortField = gridSortModel?.colId ?? '';
    const sortOrder = gridSortModel?.sort ?? '';
    sortModel = new Option({
      key: sortField,
      value: sortOrder,
    })

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
    const pageBase = new PageBase(
      {
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        totalCount: this.totalCount
      }
    )

    // 組裝請求資料
    const reqData: MailHunterSearchListRequest = {
      page: pageBase,
      sortModel: sortModel,
      filterModel: filterModel,
      fieldModel: fieldData,
    };
    //#endregion

    this.mailHunterManageService.GetProjectMailCountList(reqData)
      .pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message || '查詢列表失敗'
          });
          throw Error(err.message);
        }),
        tap(res => {
          this.rowData = res.Data.SearchItem;
          this.totalCount = res.Data.Page.TotalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        }),
        takeUntil(this.destroy$),
        finalize(() => {
          this.isApiFinish = false;
        })
      ).subscribe();
  }

  //  **處理分頁按鈕點擊**
  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return; // 避免超過範圍
    this.currentPage = page;
    this.Search();
  }

  //  **處理排序改變**
  onSortChanged() {
    this.currentPage = 1; // 重新排序時回到第一頁
    this.Search();
  }

  //  **處理篩選改變**
  onFilterChanged() {
    this.currentPage = 1; // 重新篩選時回到第一頁
    this.Search();
  }
  //#endregion

}
