import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { LoginRequest } from "../../core/models/requests/login.model";
import { ConfigService } from "../../core/services/config.service";
import { HttpMethod } from "../../core/enums/http-method";

@Injectable()
export class AuthManageService {
  private baseUrl: string = "";
  readonly authFunc = 'Auth/';
  readonly loginFunc = 'Login/';

  constructor(
    private service: ApiService,
    private configService: ConfigService
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  login(data: LoginRequest): Observable<ResponseModel<any>> {
    return this.service.doSend(HttpMethod.POST, this.baseUrl + this.authFunc + this.loginFunc, data);
  }
}
