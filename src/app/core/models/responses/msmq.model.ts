
export interface MsmqQueueDetailsResponse {
  Value: QueueInfoResponse[];
  Count: number | undefined;
}

export interface QueueInfoResponse {
  QueueName: string;
  MessagesInQueue: number;
  BytesInQueue: number;
  BytesInJournalQueue: number;
  MessagesInJournalQueue: number;
  PSComputerName: string;
}
