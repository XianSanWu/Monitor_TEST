
export interface WorkflowStepsSearchResponse {
  SearchItem: SearchItem[];
  Page: {
    PageSize: number;
    PageIndex: number;
    TotalCount: number;
    GetTotalPageCount: number;
  };
}

export interface SearchItem {
  ActivityId: string;
  ActivityName: string;
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



export interface WorkflowStepsKafkaResponse {
  PartitionLags: KafkaLagInfo[];
  TotalLag: number;
}

export interface KafkaLagInfo {
  Partition: number;
  CommittedOffset: number;
  HighWatermark: number;
  Lag: number;
}
