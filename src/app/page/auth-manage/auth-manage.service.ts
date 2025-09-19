import { Injectable } from '@angular/core';

import { ApiService } from '../../api/services/api.service';

import { filter, map, Observable, switchMap, take } from 'rxjs';

import { ResponseModel } from '../../core/models/base.model';

import { LoginRequest } from '../../core/models/requests/login.model';

import { ConfigService } from '../../core/services/config.service';

import { HttpMethod } from '../../core/enums/http-method';

@Injectable({
  providedIn: 'root', // 為了給authInterceptor使用
})
export class AuthManageService {
  readonly authFunc = 'Auth/';

  readonly loginFunc = 'Login/';

  readonly adLoginFunc = 'AuthenticateUserAsync/';

  readonly refreshTokenFunc = 'RefreshToken/';

  readonly logoutFunc = 'Logout/';

  constructor(
    private service: ApiService,

    private configService: ConfigService
  ) {
    // this.configService.configData$.subscribe(data => {
    //   this.baseUrl = data?.SERVER_URL + data?.API_URL;
    // });
  }

  getBaseUrl$(): Observable<any> {
    return this.configService.configData$.pipe(
      filter((cfg) => !!cfg), // 等待 config ready

      take(1),

      map((cfg) => (cfg as any)?.SERVER_URL + (cfg as any)?.API_URL)
    );
  }

  // 初版登入

  login(data: LoginRequest): Observable<ResponseModel<any>> {
    return this.getBaseUrl$().pipe(
      switchMap((baseUrl) =>
        this.service.doSend(
          HttpMethod.POST,
          baseUrl + this.authFunc + this.loginFunc,
          data
        )
      )
    );
  }

  // AD登入

  adLogin(data: LoginRequest): Observable<ResponseModel<any>> {
    // console.log('data', data);

    return this.getBaseUrl$().pipe(
      switchMap((baseUrl) =>
        this.service.doSend(
          HttpMethod.POST,
          baseUrl + this.authFunc + this.adLoginFunc,
          data
        )
      )
    );
  }

  //刷新Token

  refreshToken(): Observable<ResponseModel<any>> {
    return this.getBaseUrl$().pipe(
      switchMap((baseUrl) =>
        this.service.doSend(
          HttpMethod.POST,
          baseUrl + this.authFunc + this.refreshTokenFunc
        )
      )
    );
  }

  //登出

  logout(): Observable<ResponseModel<any>> {
    return this.getBaseUrl$().pipe(
      switchMap((baseUrl) =>
        this.service.doSend(
          HttpMethod.POST,
          baseUrl + this.authFunc + this.logoutFunc
        )
      )
    );
  }
}
