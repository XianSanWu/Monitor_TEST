import { Option, PageBase } from '../common/base.model';

export interface AuditSearchListRequest {
  page: PageBase;
  filterModel: Option[];
  sortModel: Option;
  fieldModel?: FieldModel;
}

export class FieldModel {
  auditName?: string[];
  userUuid?: string[];
  startDate?: Date;
  endDate?: Date;

  constructor(data: Partial<FieldModel>) {
    Object.assign(this, data);
  }
}

// export class AuditRequest {
//   auditName?: string[];
//   userUuid?: string[];
//   startDate?: Date;
//   endDate?: Date;

//   constructor(data: Partial<AuditRequest>) {
//     Object.assign(this, data);
//   }
// }
