export interface Permission {
  permissionId: string;
  name: string;
  description?: string;
  moduleId: string;
  moduleName?: string;
}

export interface CreatePermissionDto {
  name: string;
  description?: string;
  moduleId: string;
}

export interface UpdatePermissionDto {
  permissionId: string;
  name?: string;
  description?: string;
}
