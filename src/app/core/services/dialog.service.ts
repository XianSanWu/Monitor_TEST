import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from '../../component/dialog/custom-snackbar/custom-snackbar.component';
import { ConfirmDialogOption } from '../models/common/dialog.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../component/dialog/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private snackQueue: any[] = [];  // 用來存儲錯誤訊息
  private isSnackBarOpen = false;
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  openConfirmDialog(data: ConfirmDialogOption) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',  // 可以根據需求調整寬度
      data: data // 傳遞給對話框的資料
    });

    return dialogRef.afterClosed(); // 回傳對話框關閉後的結果 (如點擊確認或取消)
  }

  // openCustomSnackbar(data: any) {
  //   this.snackBar.openFromComponent(CustomSnackbarComponent, {
  //     data: data,
  //     duration: 3000,           // 預設顯示時間
  //     verticalPosition: 'top',  // 預設垂直位置
  //     horizontalPosition: 'right' // 預設水平位置
  //   });
  // }
  openCustomSnackbar(data: any) {
    this.snackQueue.push(data);
    // console.log('this.snackQueue',this.snackQueue)
    this.showNextSnackBar();
  }

  private showNextSnackBar() {
    if (this.isSnackBarOpen || this.snackQueue.length === 0) {
      return;
    }

    this.isSnackBarOpen = true;
    const data = this.snackQueue.shift();  // 取出佇列中的第一條錯誤訊息
    // console.log('this.data',data)

    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: data,
      duration: 3000,  // 顯示時間 3 秒
      verticalPosition: 'top',
      horizontalPosition: 'right',
    }).afterDismissed().subscribe(() => {
      this.isSnackBarOpen = false;
      this.showNextSnackBar();  // 顯示下一條錯誤訊息
    });
  }
}
