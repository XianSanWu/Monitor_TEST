import { BaseConditionModel } from '../common/base-condition.model';
import { Option, PageBase } from '../common/base.model';
import { FieldWithMetadataModel } from '../common/field-with-metadata.model';

//#region 查詢用
export interface PermissionRequest {
  page: PageBase;
  filterModel?: Option[];
  sortModel?: Option;
  fieldModel?: FieldModel;
}

export class FieldModel {
  Id?: number;
  Uuid?: string;
  ParentUuid?: string;
  FeatureName?: string;
  ModuleName?: string;
  Title?: string;
  Icon?: string;
  Link?: string;
  Action?: string;
  IsUse?: boolean;
  ActionMap?: Record<string, any>;
  BitValue?: number;
  Sort?: number;
  IsVisible?: boolean;
  constructor(data: Partial<FieldModel>) {
    Object.assign(this, data);
  }
}
//#endregion

//#region 更新用
export class PermissionUpdateRequest {
  FieldRequest?: Array<PermissionUpdateFieldRequest>;
  // ConditionRequest?: Array<PermissionUpdateConditionRequest>;
}

//更新欄位
export interface PermissionUpdateFieldRequest {
  Uuid: string;
  ParentUuid?: string | null;
  Icon?: string | null;
  ModuleName?: string;
  FeatureName?: string | null;
  Title?: string;
  Action?: string | null;
  Link?: string | null;
  BitValue: number;
  Sort?: number;
  IsUse?: boolean;
  IsVisible?: boolean;
}

/** 更新[條件] */
export class PermissionUpdateConditionRequest extends BaseConditionModel {
  Uuid?: FieldWithMetadataModel = new FieldWithMetadataModel();
}

//#endregion
