import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { CdpManageService } from '../cdp-manage.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { GridApi, ColDef } from 'ag-grid-community';
import { catchError, tap, takeUntil, finalize } from 'rxjs';
import { RestStatus } from '../../../common/enums/rest-enum';
import { CustomFilterComponent } from '../../../component/ag-grid/custom-filter/custom-filter.component';
import { Option, PageBase } from '../../../core/models/common/base.model';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'edm',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicInputComponent,
    AgGridModule,
  ],
  providers: [CdpManageService],
  templateUrl: './edm.component.html',
  styleUrl: './edm.component.scss'
})
export default class EdmComponent extends BaseComponent {
  constructor(
    // private dialog: MatDialog,
    private dialogService: DialogService,
    private cdpManageService: CdpManageService
  ) {
    super();
    // 初始化表單
    this.validateForm = new FormGroup({
      channel: new FormControl('EDM', []),
    });
  }

  validateForm: FormGroup;

  //#region Ag-grid
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  gridApi!: GridApi;
  rowData: any[] = [];
  defaultColDef = {
    sortable: true,
    filter: CustomFilterComponent
  };

  columnDefs: ColDef[] = [
    // { headerName: 'SN', field: 'SN' },
    // { headerName: 'WorkflowUuid', field: 'WorkflowUuid' },
    { headerName: '愛酷 SendUuid', field: 'SendUuid' },
    { headerName: '愛酷 BatchId', field: 'BatchId' },
    // { headerName: 'JourneyId', field: 'JourneyId' },
    { headerName: '進度狀態', field: 'Status' },
    { headerName: '旅程名稱', field: 'JourneyName' },
    { headerName: '旅程狀態', field: 'JourneyStatus' },
    // { headerName: 'NodeId', field: 'NodeId' },
    { headerName: '節點名稱', field: 'NodeName' },
    { headerName: '來源', field: 'Channel' },
    { headerName: '旅程/群發', field: 'ChannelType' },
    // { headerName: 'FTP檔案名稱', field: 'UploadFileName' },
    { headerName: '建立時間', field: 'CreateAt' },
    { headerName: '更新時間', field: 'UpdateAt' },
    { headerName: '旅程建立時間', field: 'JourneyCreateAt' },
    { headerName: '旅程更新時間', field: 'JourneyUpdateAt' },
    { headerName: '群發建立時間', field: 'GroupSendCreateAt' },
    { headerName: '群發更新時間', field: 'GroupSendUpdateAt' },
  ];


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
    const reqData = {
      fieldModel: this.validateForm.getRawValue(),
      page: pageBase,
      sortModel: sortModel,
      filterModel: filterModel
    };
    const reqData1 = this.validateForm.getRawValue();

    console.log('requestData', reqData)
    console.log('reqData1', reqData1)

    this.cdpManageService.getSearchList(reqData)
      .pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message || 'An error occurred during login.'
          });
          throw Error(err.message);
        }),
        tap(res => {
          if (res.Status?.toString() !== RestStatus.SUCCESS) {
            this.dialogService.openCustomSnackbar({
              message: res.Message
            });
            return;
          }

          if (res) {
            this.rowData = res.Data.SearchItem;
            this.totalCount = res.Data.Page.TotalCount;
            this.totalPages = Math.ceil(this.totalCount / this.pageSize);
          }
        }),
        takeUntil(this.destroy$),
        finalize(() => {
        })
      ).subscribe();
  }

  //  **處理分頁按鈕點擊**
  onPageChange(page: number) {
    console.log('page', page)
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
