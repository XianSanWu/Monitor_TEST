import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  ],
  providers: [LoadingService],
  templateUrl: './test1.component.html',
  styleUrl: './test1.component.scss'
})
export default class Test1Component {

  constructor(
    // private dialog: MatDialog,
    private dialogService: DialogService
  ) {
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
    this.loadData();

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
  columnDefs = [
    { field: 'id', headerName: 'ID', sortable: true, filter: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    { field: 'email', headerName: 'Email', sortable: true, filter: true }
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
    // const sortModel = this.gridApi?.getSortModel() || [];
    // const sortField = sortModel.length > 0 ? sortModel[0].colId : '';
    // const sortOrder = sortModel.length > 0 ? sortModel[0].sort.toUpperCase() : '';

    // // 取得 ag-Grid 的篩選條件
    // const filterModel = this.gridApi?.getFilterModel() || {};
    // const filterField = Object.keys(filterModel)[0] || ''; // 取第一個篩選的欄位
    // const filterValue = filterField ? filterModel[filterField].filter : '';

    // // 組裝請求資料
    // const requestData = {
    //   Page: {
    //     PageSize: this.pageSize,
    //     PageIndex: this.currentPage,
    //     TotalCount: this.totalCount
    //   },
    //   field: filterField || sortField, // 先篩選再排序
    //   Sort: sortOrder || '',
    //   filter: filterValue || ''
    // };

    // this.apiService.postUsers(requestData).subscribe((response) => {
    //   this.rowData = response.items;
    //   this.totalCount = response.totalCount;
    //   this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    // });
  }

  // 🚀 **處理分頁按鈕點擊**
  onPageChange(page: number) {
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

