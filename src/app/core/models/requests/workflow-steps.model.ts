import { PageBase ,Option } from "../common/base.model";

export interface WorkflowStepsSearchListRequest {
  page: PageBase;
  filterModel: Option[];
  sortModel: Option;
  fieldModel?: FieldModel;
}

export class FieldModel {
  channel?: string;

  constructor(data: Partial<FieldModel>) {
    Object.assign(this, data);
  }
}

export class WorkflowStepsKafkaRequest{
  channel?: string;

  constructor(data: Partial<WorkflowStepsKafkaRequest>) {
    Object.assign(this, data);
  }
}
