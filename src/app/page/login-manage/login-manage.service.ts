import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { LoginRequest } from "../../core/models/requests/login.model";
import { ConfigService } from "../../core/services/config.service";

@Injectable()
export class LoginManageService {
  private baseUrl: string = "";
  readonly loginFunc = 'Login/';

  constructor(
    private service: ApiService,
    private configService: ConfigService
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  loginVerify(data: LoginRequest): Observable<ResponseModel<any>> {
    return this.service.doSend('post', this.baseUrl + this.loginFunc + 'Verify', data);
  }
}
