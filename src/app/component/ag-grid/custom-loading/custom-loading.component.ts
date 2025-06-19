import { Component } from '@angular/core';
import type { ILoadingCellRendererComp, ILoadingCellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'custom-loading',
  template: `<span class="loading-message">{{ loadingMessage }}</span>`,
  styleUrls: ['./custom-loading.component.scss']
})
export class CustomLoadingComponent implements ILoadingCellRendererComp {
  loadingMessage: string = '資料讀取中，請稍候...';
  eGui!: HTMLElement;

  // 初始化時接收參數
  init(params: ILoadingCellRendererParams & { loadingMessage?: string }): void {
    if (params.loadingMessage) {
      this.loadingMessage = params.loadingMessage;
    }
  }

  getGui(): HTMLElement {
    const span = document.createElement('span');
    span.classList.add('loading-message');
    span.innerText = this.loadingMessage;
    return span;
  }

  refresh(params: ILoadingCellRendererParams): boolean {
    return false;  // 不需要重新渲染
  }
}
