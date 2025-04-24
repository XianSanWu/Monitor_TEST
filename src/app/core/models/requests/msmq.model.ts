export class MsmqQueueInfoRequest {
  queueName?: string;

  constructor(data: Partial<MsmqQueueInfoRequest>) {
    Object.assign(this, data);
  }
}

