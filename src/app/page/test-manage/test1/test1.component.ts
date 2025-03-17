import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../../core/services/loading.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DropdownComponent } from '../../../component/form/dropdown/dropdown.component';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { ConfirmDialogOption } from '../../../core/models/common/dialog.model';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'test1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    DropdownComponent,
    BasicInputComponent
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
      testControl: new FormControl('', [Validators.required,])
    });
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


  // openConfirmDialog() {
  //   const option: ConfirmDialogOption = {
  //     title: '確認操作',
  //     content: '你確定要執行此操作嗎？',
  //     leftButtonName: '取消',
  //     rightButtonName: '確定',
  //     leftCallback: () => console.log('取消'),
  //     rightCallback: () => console.log('確定'),
  //     isCloseBtn: true
  //   };
  //   const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: option });

  //   dialogRef.afterClosed().subscribe();
  // }


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

  onValueChange(value: any) {
    console.log('Selected Value:', value);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('111111111')
  }
}

