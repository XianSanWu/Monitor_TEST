import { Component } from '@angular/core';
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
import { ColDef } from 'ag-grid-community';

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
  ],
  providers: [LoadingService],
  templateUrl: './test1.component.html',
  styleUrl: './test1.component.scss'
})
export class Test1Component {

  constructor(
    // private dialog: MatDialog,
    private dialogService: DialogService
  ) {
    // 初始化表單
    this.form = new FormGroup({
      username: new FormControl('', [Validators.required, ValidatorsUtil.blank, ValidatorsUtil.intSymbolsEnglishNumbers]),
      testControl: new FormControl('', [Validators.required,]),
      date: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt, ValidatorsUtil.dateNotBeforeToday]),
      startDate: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt]),
      endDate: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt])
    }, { validators: ValidatorsUtil.dateRangeValidator });
  }

  form: FormGroup;

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


}

