import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/services/api.service';
import { HttpMethod } from '../../core/enums/http-method';
import { ResponseModel } from '../../core/models/base.model';
import { UserRequest, UserUpdateRequest } from '../../core/models/requests/permission-model';
import { ConfigService } from '../../core/services/config.service';

@Injectable()
export class PermissionManageService {
  private baseUrl: string = '';
  readonly permissionFunc = 'Permission/';
  readonly isUseUserAsync = 'isUseUserAsync/';
  readonly getUsersAsync = 'GetUserListAsync/';
  readonly getPermissionListAsync = 'GetPermissionListAsync/';
  readonly getUserPermissionsAsync = 'GetUserPermissionsAsync/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService
  ) {
    this.configService.configData$.subscribe((data) => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
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
  GetPermissionListAsync(): Observable<ResponseModel<any>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.permissionFunc + this.getPermissionListAsync
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
}
