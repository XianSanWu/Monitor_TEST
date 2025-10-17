export interface AuditSearchResponse {
  SearchItem: SearchItem[];
  Page: {
    PageSize: number;
    PageIndex: number;
    TotalCount: number;
    GetTotalPageCount: number;
  };
}

export interface SearchItem {
  Id: number;
  UserId: string;
  UserName: string;
  FrontUrl: string;
  FrontActionName: string;
  BackActionName: string;
  HttpMethod: string;
  HttpStatusCode: string;
  RequestPath: string;
  Parameters: string;
  IpAddress: string;
  CreateAt: Date;
}

// export interface AuditResponse {
//   Id: number;
//   UserId: string;
//   UserName: string;
//   FrontUrl: string;
//   FrontActionName: string;
//   BackActionName: string;
//   HttpMethod: string;
//   HttpStatusCode: string;
//   RequestPath: string;
//   Parameters: string;
//   IpAddress: string;
//   CreateAt: Date;
// }
