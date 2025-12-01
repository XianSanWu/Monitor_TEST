import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi } from 'ag-grid-community';
import { catchError, finalize, takeUntil, tap } from 'rxjs';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { CustomFilterComponent } from '../../../component/ag-grid/custom-filter/custom-filter.component';
import { DynamicBarComponent } from '../../../component/chart/dynamic-bar/dynamic-bar.component';
import { DynamicLineChartComponent } from '../../../component/chart/dynamic-line-chart-component/dynamic-line-chart-component.component';
import { NumberCenterComponent } from '../../../component/chart/number-center/number-center.component';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { CollapsibleSectionComponent } from '../../../component/form/collapsible-section/collapsible-section.component';
import { DateRangeComponent } from '../../../component/form/date-range/date-range.component';
import { DateComponent } from '../../../component/form/date/date.component';
import { DropdownComponent } from '../../../component/form/dropdown/dropdown.component';
import { SearchMultiselectComponent } from '../../../component/form/search-multiselect/search-multiselect.component';
import { SearchSelectComponent } from '../../../component/form/search-select/search-select.component';
import { RestStatus } from '../../../core/enums/rest-enum';
import { Option, PageBase } from '../../../core/models/common/base.model';
import { ConfirmDialogOption } from '../../../core/models/common/dialog.model';
import {
  FieldModel,
  WorkflowStepsSearchListRequest,
} from '../../../core/models/requests/workflow-steps.model';
import { DialogService } from '../../../core/services/dialog.service';
import { BaseComponent } from '../../base.component';
import { TestManageService } from '../test-manage.service';

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
    CollapsibleSectionComponent,
    DynamicLineChartComponent,
    SearchMultiselectComponent,
    DynamicBarComponent,
    NumberCenterComponent,
  ],
  providers: [TestManageService],
  templateUrl: './test1.component.html',
  styleUrl: './test1.component.scss',
})
export default class Test1Component extends BaseComponent {
  constructor(
    // private dialog: MatDialog,
    private dialogService: DialogService,
    private testManageService: TestManageService
  ) {
    super();
    // 初始化表單
    this.validateForm = new FormGroup(
      {
        username: new FormControl('', [
          Validators.required,
          ValidatorsUtil.blank,
          ValidatorsUtil.intSymbolsEnglishNumbers,
        ]),
        testControl: new FormControl('', [Validators.required]),
        testControl1: new FormControl(1, [Validators.required]),
        date: new FormControl('', [
          Validators.required,
          ValidatorsUtil.dateFmt,
          ValidatorsUtil.dateNotBeforeToday,
        ]),
        startDate: new FormControl('', [
          Validators.required,
          ValidatorsUtil.dateFmt,
        ]),
        endDate: new FormControl('', [
          Validators.required,
          ValidatorsUtil.dateFmt,
        ]),
        searchSelect: new FormControl('', [
          Validators.required,
          ValidatorsUtil.blank,
          ValidatorsUtil.intSymbolsEnglishNumbers,
        ]),
        tags: new FormControl(null, [Validators.required]),
      },
      { validators: ValidatorsUtil.dateRangeValidator }
    );
  }

  validateForm: FormGroup;

  // 假資料
  selectList = {
    options: [
      { id: 1, name: 'Option 1' },
      { id: 2, name: 'Option 2' },
      { id: 3, name: 'Option 3' },
    ],
    key: 'id',
    val: 'name',
  };

  disabledSelectList = {
    options: [{ id: 2, name: 'Option 2' }],
    key: 'id',
    val: 'name',
  };

  tagOptions: Option[] = [
    { key: 'A', value: '蘋果' },
    { key: 'B', value: '香蕉' },
    { key: 'C', value: '芭樂' },
    { key: 'D', value: '西瓜西瓜西瓜西瓜西瓜' },
  ];

  onSelectedTags(keys: string[]) {
    console.log('目前選擇：', keys);
  }

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
      },
    };

    // 開啟確認對話框
    this.dialogService.openConfirmDialog(dialogData).subscribe();
  }

  openCustomSnackbar() {
    this.dialogService.openCustomSnackbar({
      message: '錯誤訊息內容',
    });
  }

  onValueChange(value: any) {
    console.log('Selected Value:', value);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('TEST_PAGE_11111');
  }

  items = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Pineapple'];
  options: Option[] = [
    { key: '1', value: 'Apple' },
    { key: '2', value: 'Banana' },
    { key: '3', value: 'Cherry' },
    { key: '4', value: 'Date' },
    { key: '5', value: 'Elderberry' },
  ];

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
    filter: CustomFilterComponent,
  };

  columnDefs: ColDef[] = [
    { headerName: 'SN', field: 'SN' },
    { headerName: 'WorkflowUuid', field: 'WorkflowUuid' },
    { headerName: 'SendUuid', field: 'SendUuid' },
    { headerName: 'BatchId', field: 'BatchId' },
    { headerName: 'ActivityId', field: 'ActivityId' },
    { headerName: 'ActivityName', field: 'ActivityName' },
    { headerName: 'ActivityStatus', field: 'ActivityStatus' },
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

  //  **呼叫後端 API 載入資料**
  loadData() {
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
    const reqData: WorkflowStepsSearchListRequest = {
      page: pageBase,
      sortModel: sortModel,
      filterModel: filterModel,
      fieldModel: new FieldModel({ channel: '' }),
    };

    // console.log('requestData', reqData)

    this.testManageService
      .getSearchList(reqData)
      .pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message || '查詢列表失敗',
          });
          throw Error(err.message);
        }),
        tap((res) => {
          if (res.Status?.toString() !== RestStatus.SUCCESS) {
            this.dialogService.openCustomSnackbar({
              message: res.Message,
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
        finalize(() => {})
      )
      .subscribe();
  }

  //  **處理分頁按鈕點擊**
  onPageChange(page: number) {
    // console.log('page', page)
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

  bar_options = [
    new Option({ key: '1', value: '10' }),
    new Option({ key: '2', value: '20' }),
    new Option({ key: '3', value: '15' }),
    new Option({ key: '4', value: '15' }),
    new Option({ key: '5', value: '15' }),
    new Option({ key: '6', value: '15' }),
    new Option({ key: '7', value: '15' }),
    new Option({ key: '8', value: '15' }),
    new Option({ key: '9', value: '15' }),
    new Option({ key: '10', value: '15' }),
    new Option({ key: '11', value: '15' }),
    new Option({ key: '12', value: '15' }),
  ];

  center_value = 75;
  center_max = 100;
}
