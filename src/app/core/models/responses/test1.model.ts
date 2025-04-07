
export interface SearchResponse {
  SearchItem: SearchItem[];
  Page: {
    PageSize: number;
    PageIndex: number;
    TotalCount: number;
    GetTotalPageCount: number;
  };
}

export interface SearchItem {
  JourneyId: string;
  JourneyName: string;
  NodeId: string;
  NodeName: string;
  Channel: string;
  SendUuid: string | null;
  Status: string | null;
  Message: string | null;
  StartAt: string;
  StopAt: string;
  ActiveType: string | null;
  SN: string;
  SeqNo: number;
}
