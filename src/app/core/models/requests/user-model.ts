import { BaseConditionModel } from '../common/base-condition.model';
import { Option, PageBase } from '../common/base.model';
import { FieldWithMetadataModel } from '../common/field-with-metadata.model';

export interface UserRequest {
  page: PageBase;
  filterModel?: Option[];
  sortModel?: Option;
  fieldModel?: FieldModel;
}

export class FieldModel {
  Uuid?: string;
  UserName?: string;
  IsUse?: boolean;

  constructor(data: Partial<FieldModel>) {
    Object.assign(this, data);
  }
}

//#region 更新
export class UserUpdateRequest {
  FieldRequest?: UserUpdateFieldRequest;
  ConditionRequest?: Array<UserUpdateConditionRequest>;
}
//#endregion

//#region 更新[欄位]
/** User更新[欄位] */
export class UserUpdateFieldRequest {
  UserName?: string;
  IsUse?: boolean;
  FeatureMask?: number;
}
//#endregion

//#region 更新[條件]
/** User更新[條件] */
export class UserUpdateConditionRequest extends BaseConditionModel {
  UserName?: FieldWithMetadataModel = new FieldWithMetadataModel();
  Uuid?: FieldWithMetadataModel = new FieldWithMetadataModel();
}
//#endregion
