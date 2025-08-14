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
}

export interface GroupedPermissions {
  header: FeaturePermission;
  items: FeaturePermission[];
}
