import { Option,PageBase } from "../common/base.model";

export interface MailHunterSearchListRequest {
  page: PageBase;
  filterModel: Option[];
  sortModel: Option;
  fieldModel?: FieldModel;
}

export class FieldModel {
  department?: string;
  startDate?: Date;
  endDate?: Date;

  constructor(data: Partial<FieldModel>) {
    Object.assign(this, data);
  }
}
