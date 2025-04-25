export interface MailHunterSearchResponse {
  SearchItem: SearchItem[];
  Page: {
    PageSize: number;
    PageIndex: number;
    TotalCount: number;
    GetTotalPageCount: number;
  };
}

export interface SearchItem {
  /** 專案發送的年份 */
  year: number;

  /** 專案發送的月份 */
  month?: string;

  /** 每月的專案數量 */
  projectCount: number;

  /** 每月專案涉及的用戶總數 */
  projectOriginTotalUser: number;
}
