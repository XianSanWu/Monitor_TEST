import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'link-render',
  standalone: true,
  imports: [],
  template: `
    <a (click)="navigateToLink()"
       style="color: #007bff; text-decoration: underline; cursor: pointer;">
      {{ value }}
    </a>
  `
})
export class LinkRenderComponent implements ICellRendererAngularComp {
  value: string = '';
  basePath: string = '';      // 基礎路徑
  routeParams: any = {};     // 動態參數
  fullLink: any[] = [];      // 最終組合的路徑和參數

  constructor(private router: Router) {}

  agInit(params: any): void {
    this.value = params.value; //自動帶路欄位參數
    this.basePath = params?.basePath || '';
    this.routeParams = params?.routeParams || {};

    this.fullLink = this.buildLink(this.basePath, this.routeParams, this.value);
    // console.log('fullLink:', this.fullLink); // 最終路徑
  }

  // 動態組合路徑和參數
  private buildLink(basePath: string, routeParams: any, value: any): any[] {
    const segments = basePath.split('/').filter(Boolean);

    // 沒有 routeParams 的話，加入 value 當作唯一動態參數
    if (!routeParams || Object.keys(routeParams).length === 0) {
      return [...segments, value];
    }

    // 否則組合所有參數（若為空則預設用 value）
    const params = Object.values(routeParams).map(param => param || value);
    return [...segments, ...params];
  }

  // 使用 Router 進行導航
  navigateToLink(): void {
    this.router.navigate(this.fullLink);
  }

  refresh(): boolean {
    return false;
  }
}
