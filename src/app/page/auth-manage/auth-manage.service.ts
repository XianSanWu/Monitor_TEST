import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/services/api.service';
import { HttpMethod } from '../../core/enums/http-method';
import { ResponseModel } from '../../core/models/base.model';
import { LoginRequest } from '../../core/models/requests/login.model';
import { ConfigService } from '../../core/services/config.service';

@Injectable({
  providedIn: 'root'  // 為了給authInterceptor使用
})
export class AuthManageService {
  private baseUrl: string = '';
  readonly authFunc = 'Auth/';
  readonly loginFunc = 'Login/';
  readonly refreshTokenFunc = 'RefreshToken/';

  constructor(
    private service: ApiService,
    private configService: ConfigService
  ) {
    this.configService.configData$.subscribe((data) => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  login(data: LoginRequest): Observable<ResponseModel<any>> {
    return this.service.doSend(
      HttpMethod.POST,
      this.baseUrl + this.authFunc + this.loginFunc,
      data
    );
  }

  refreshToken(): Observable<ResponseModel<any>> {
    return this.service.doSend(
      HttpMethod.POST,
      this.baseUrl + this.authFunc + this.refreshTokenFunc
    );
  }
}
