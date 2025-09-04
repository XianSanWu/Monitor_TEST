import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/services/api.service';
import { HttpMethod } from '../../core/enums/http-method';
import { ResponseModel } from '../../core/models/base.model';
import { PermissionRequest, PermissionUpdateRequest } from '../../core/models/requests/permission-model';
import { UserRequest, UserUpdateRequest } from '../../core/models/requests/user-model';
import { ConfigService } from '../../core/services/config.service';

@Injectable()
export class PermissionManageService {
  private baseUrl: string = '';
  readonly permissionFunc = 'Permission/';
  readonly isUseUserAsync = 'IsUseUserAsync/';
  readonly saveUserAsync = 'SaveUserAsync/';
  readonly checkUpdateUserAsync = 'CheckUpdateUserAsync/';
  readonly getUsersAsync = 'GetUserListAsync/';
  readonly getPermissionListAsync = 'GetPermissionListAsync/';
  readonly getUserPermissionsAsync = 'GetUserPermissionsAsync/';
  readonly getUserPermissionsMenuAsync = 'GetUserPermissionsMenuAsync/';
  readonly saveFeaturePermissionsAsync = 'SaveFeaturePermissionsAsync/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService
  ) {
    this.configService.configData$.subscribe((data) => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  // 檢查需更新使用者是否存在
  CheckUpdateUserAsync(req: UserUpdateRequest): Observable<ResponseModel<any>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.permissionFunc + this.checkUpdateUserAsync,
      req
    );
  }

  // 儲存使用者
  SaveUserAsync(req: UserUpdateRequest): Observable<ResponseModel<any>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.permissionFunc + this.saveUserAsync,
      req
    );
  }

  //啟用及停用帳號
  IsUseUserAsync(req: UserUpdateRequest): Observable<ResponseModel<any>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.permissionFunc + this.isUseUserAsync,
      req
    );
  }

  //查詢帳號
  GetUserListAsync(req: UserRequest): Observable<ResponseModel<any>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.permissionFunc + this.getUsersAsync,
      req
    );
  }

  //查詢全部權限
  GetPermissionListAsync(req: PermissionRequest): Observable<ResponseModel<any>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.permissionFunc + this.getPermissionListAsync,
      req
    );
  }

  //查詢個人權限
  GetUserPermissionsAsync(req: UserRequest): Observable<ResponseModel<any>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.permissionFunc + this.getUserPermissionsAsync,
      req
    );
  }

  //查詢個人權限 Menu
  GetUserPermissionsMenuAsync(req: UserRequest): Observable<ResponseModel<any>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.permissionFunc + this.getUserPermissionsMenuAsync,
      req
    );
  }

  //儲存全部權限
  SaveFeaturePermissionsAsync(req: PermissionUpdateRequest): Observable<ResponseModel<any>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.permissionFunc + this.saveFeaturePermissionsAsync,
      req
    );
  }
}
