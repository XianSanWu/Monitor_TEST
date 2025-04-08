
export class PageBase {
  /** 一頁顯示幾筆資料 */
  pageSize?: number;

  /** 目前第幾頁 */
  pageIndex?: number;

  /** 總筆數 */
  totalCount?: number;

  constructor(data: Partial<PageBase>) {
    Object.assign(this, data);
  }
}


export class Option {
  key?: string;
  value?: string;

  constructor(data: Partial<Option>) {
    Object.assign(this, data);
  }
}
