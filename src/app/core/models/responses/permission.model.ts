export interface FeaturePermission {
  Id: number;
  Uuid: string;
  ParentUuid: string | null;
  Icon: string | null;
  ModuleName: string;
  FeatureName: string;
  Title: string;
  Action: string | null;
  Link: string | null;
  BitValue: number;
  Sort: number;
  IsUse: boolean;
  IsVisible: boolean;

  // 新增 ActionMap 用來控制每個 action 勾選
  ActionMap: { [actionName: string]: boolean };
}

export interface GroupedPermissions {
  header: FeaturePermission;
  items: FeaturePermission[];
}
