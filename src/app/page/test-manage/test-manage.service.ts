import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../models/base.model";
import { LoginRequest } from "../../models/requests/login.model";

@Injectable()
export class TestManageService {
  readonly loginFunc = 'Login/';

  constructor(private service: ApiService) { }

  loginVerify(data: LoginRequest): Observable<ResponseModel<any>> {
    return this.service.doSend('post', this.loginFunc + 'Verify', data);
  }

}
