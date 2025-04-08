import { catchError, finalize, takeUntil, tap } from 'rxjs';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../../core/services/loading.service';
import { DropdownComponent } from '../../../component/form/dropdown/dropdown.component';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { ConfirmDialogOption } from '../../../core/models/common/dialog.model';
import { DialogService } from '../../../core/services/dialog.service';
import { DateRangeComponent } from "../../../component/form/date-range/date-range.component";
import { DateComponent } from '../../../component/form/date/date.component';
import { SearchSelectComponent } from '../../../component/form/search-select/search-select.component';
import { ColDef, GridApi } from 'ag-grid-community';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { CustomFilterComponent } from '../../../component/ag-grid/custom-filter/custom-filter.component';
import { Option, PageBase } from '../../../core/models/common/base.model';
import { TestManageService } from '../test-manage.service';
import { RestStatus } from '../../../common/enums/rest-enum';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'test1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownComponent,
    BasicInputComponent,
    DateComponent,
    DateRangeComponent,
    SearchSelectComponent,
    AgGridModule,
    FormsModule,
  ],
  providers: [LoadingService, TestManageService],
  templateUrl: './test1.component.html',
  styleUrl: './test1.component.scss'
})
export default class Test1Component extends BaseComponent {

  constructor(
    // private dialog: MatDialog,
    private dialogService: DialogService,
    private testManageService: TestManageService
  ) {
    super();
    // 初始化表單
    this.validateForm = new FormGroup({
      username: new FormControl('', [Validators.required, ValidatorsUtil.blank, ValidatorsUtil.intSymbolsEnglishNumbers]),
      testControl: new FormControl('', [Validators.required,]),
      date: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt, ValidatorsUtil.dateNotBeforeToday]),
      startDate: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt]),
      endDate: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt]),
      searchSelect: new FormControl('', [Validators.required, ValidatorsUtil.blank, ValidatorsUtil.intSymbolsEnglishNumbers]),
    }, { validators: ValidatorsUtil.dateRangeValidator });
  }

  validateForm: FormGroup;

  // 假資料
  selectList = {
    options: [
      { id: 1, name: 'Option 1' },
      { id: 2, name: 'Option 2' },
      { id: 3, name: 'Option 3' }
    ],
    key: 'id',
    val: 'name'
  };

  disabledSelectList = {
    options: [
      { id: 2, name: 'Option 2' }
    ],
    key: 'id',
    val: 'name'
  };

  openConfirmDialog() {
    const dialogData: ConfirmDialogOption = {
      title: '確認操作',
      content: '你確定要執行此操作嗎？',
      leftButtonName: 'Cancel',
      midButtonName: 'midCancel',
      rightButtonName: 'OK',
      isCloseBtn: true,
      leftCallback: () => {
        console.log('Cancel clicked');
      },
      midCallback: () => {
        console.log('midCancel clicked');
      },
      rightCallback: () => {
        console.log('OK clicked');
      }
    };

    // 開啟確認對話框
    this.dialogService.openConfirmDialog(dialogData).subscribe();
  }

  openCustomSnackbar() {
    this.dialogService.openCustomSnackbar({
      message: '錯誤訊息內容'
    });
  }

  onValueChange(value: any) {
    console.log('Selected Value:', value);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('TEST_PAGE_11111')
  }


  items = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Pineapple'];
  selectedItem = '';

  onItemSelected(value: string) {
    this.selectedItem = value;
    console.log('選中的值:', value);
  }



  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  gridApi!: GridApi;
  rowData: any[] = [];
  defaultColDef = {
    sortable: true,
    filter: CustomFilterComponent
  };

  columnDefs = [
    { headerName: 'SN', field: 'SN' },
    { headerName: 'WorkflowUuid', field: 'WorkflowUuid' },
    { headerName: 'SendUuid', field: 'SendUuid' },
    { headerName: 'BatchId', field: 'BatchId' },
    { headerName: 'JourneyId', field: 'JourneyId' },
    { headerName: 'JourneyName', field: 'JourneyName' },
    { headerName: 'JourneyStatus', field: 'JourneyStatus' },
    { headerName: 'NodeId', field: 'NodeId' },
    { headerName: 'NodeName', field: 'NodeName' },
    { headerName: 'Channel', field: 'Channel' },
    { headerName: 'ChannelType', field: 'ChannelType' },
    { headerName: 'UploadFileName', field: 'UploadFileName' },
    { headerName: 'Status', field: 'Status' },
    { headerName: 'CreateAt', field: 'CreateAt' },
    { headerName: 'UpdateAt', field: 'UpdateAt' },
    { headerName: 'JourneyCreateAt', field: 'JourneyCreateAt' },
    { headerName: 'JourneyUpdateAt', field: 'JourneyUpdateAt' },
    { headerName: 'GroupSendCreateAt', field: 'GroupSendCreateAt' },
    { headerName: 'GroupSendUpdateAt', field: 'GroupSendUpdateAt' },
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

  // 🚀 **呼叫後端 API 載入資料**
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
      Page: pageBase,
      sortModel: sortModel,
      filterModel: filterModel
    };

    console.log('requestData', reqData)

    this.testManageService.getSearchList(reqData)
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

  // 🚀 **處理分頁按鈕點擊**
  onPageChange(page: number) {
    console.log('page',page)
    if (page < 1 || page > this.totalPages) return; // 避免超過範圍
    this.currentPage = page;
    this.loadData();
  }

  // 🚀 **處理排序改變**
  onSortChanged() {
    this.currentPage = 1; // 重新排序時回到第一頁
    this.loadData();
  }

  // 🚀 **處理篩選改變**
  onFilterChanged() {
    this.currentPage = 1; // 重新篩選時回到第一頁
    this.loadData();
  }



}

