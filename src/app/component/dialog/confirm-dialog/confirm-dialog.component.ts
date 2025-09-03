import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'; // 引入 Material 按鈕模組
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'; // 引入 MatDialogRef
import { ConfirmDialogOption } from '../../../core/models/common/dialog.model';

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule], // 引入必需的模組
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogOption,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  option: ConfirmDialogOption = {};
  lastVisibleButton: HTMLElement | null = null;

  ngOnInit() {
    this.option = this.data || {}; // 確保 option 不為 undefined
    this.setDefaultValues();
    this.wrapCallbacks();
  }

  ngAfterViewChecked(): void {
    const buttons = Array.from(document.querySelectorAll('button')) as HTMLElement[];
    const visibleButtons = buttons.filter(button => button.offsetParent !== null); // 篩選出顯示的按鈕

    if (visibleButtons.length > 0) {
      const lastButton = visibleButtons[visibleButtons.length - 1];

      // 只對最後顯示的按鈕加上 cdkFocusInitial
      if (this.lastVisibleButton !== lastButton) {
        if (this.lastVisibleButton) {
          this.lastVisibleButton.removeAttribute('cdkFocusInitial'); // 移除之前按鈕的 cdkFocusInitial
        }
        lastButton.setAttribute('cdkFocusInitial', 'true'); // 為最後顯示的按鈕加上 cdkFocusInitial
        this.lastVisibleButton = lastButton;
      }
    }
  }

  setDefaultValues() {
    this.option.leftButtonName = this.getValidButtonName(this.option.leftButtonName, '取消');
    this.option.rightButtonName = this.getValidButtonName(this.option.rightButtonName, '確認');
    this.option.isCloseBtn = this.option.isCloseBtn ?? true;
  }

  getValidButtonName(value: string | undefined, defaultValue: string): string {
    return value && value !== 'hide' ? value : defaultValue;
  }

  wrapCallbacks() {
    this.option.leftCallback = this.wrapWithClose(this.option.leftCallback);
    this.option.midCallback = this.wrapWithClose(this.option.midCallback);
    this.option.rightCallback = this.wrapWithClose(this.option.rightCallback);
  }

  wrapWithClose(callback?: () => void): () => void {
    return callback ? () => { callback(); this.close(); } : () => this.close();
  }

  close() {
    this.dialogRef.close(); // 使用 MatDialogRef 來關閉對話框
  }
}
