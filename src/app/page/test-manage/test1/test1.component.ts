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
    console.log('TEST_PAGE_11111')
  }


  items = ['Apple', 'Banana', 'Cherry', 'Mango', 'Orange', 'Pineapple'];
  selectedItem = '';

  onItemSelected(value: string) {
    this.selectedItem = value;
    console.log('選中的值:', value);
  }

  @ViewChild('agGrid') agGrid!: AgGridAngular;
  rowData: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  gridApi!: GridApi;
  columnDefs: ColDef[] = [
    {
      headerName: "Active Type",
      field: "ActiveType",
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: "Journey Name",
      field: "JourneyName",
      sortable: true,
      filter: true,
      width: 200
    },
    {
      headerName: "Node Name",
      field: "NodeName",
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: "Channel",
      field: "Channel",
      sortable: true,
      filter: true,
      width: 150
    },
    {
      headerName: "Status",
      field: "Status",
      sortable: true,
      filter: true,
      width: 120
    },
    {
      headerName: "Message",
      field: "Message",
      sortable: false,
      filter: true,
      width: 200
    },
    {
      headerName: "Start At",
      field: "StartAt",
      sortable: true,
      filter: 'agDateColumnFilter',
      width: 180,
      valueFormatter: (params) => {
        // 格式化日期
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    },
    {
      headerName: "Stop At",
      field: "StopAt",
      sortable: true,
      filter: 'agDateColumnFilter',
      width: 180,
      valueFormatter: (params) => {
        // 格式化日期
        return params.value ? new Date(params.value).toLocaleString() : '';
      }
    }
  ];

  loadData() {
    const sortModel = this.gridApi.onSortChanged();
    const filterModel = this.agGrid.api.getFilterModel();

    // // 取得排序欄位和排序方式
    // const sortField = sortModel.length > 0 ? sortModel[0].colId : '';
    // const sortOrder = sortModel.length > 0 ? sortModel[0].sort : '';

    // // 篩選條件
    // const filter: any = {};
    // for (const field in filterModel) {
    //   if (filterModel.hasOwnProperty(field)) {
    //     filter[field] = filterModel[field].filter;
    //   }
    // }

    // this.apiService.getUsers(this.pageSize, this.currentPage - 1, sortField, sortOrder, filter).subscribe((data) => {
    //   this.rowData = data.items;  // 假設後端回傳資料格式 { items: [], totalCount: 0 }
    //   this.totalCount = data.totalCount;
    //   this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    // });
  }

  /** 當排序變更時，重新載入資料 */
  onSortChanged() {
    this.loadData();
  }

  /** 當篩選條件變更時，重新載入資料 */
  onFilterChanged() {
    this.loadData();
  }

  /** 換頁 */
  onPageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

}

