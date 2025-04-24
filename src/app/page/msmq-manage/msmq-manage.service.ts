import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { ConfigService } from "../../core/services/config.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { HttpMethod } from "../../core/enums/http-method";
import { MsmqQueueInfoRequest } from "../../core/models/requests/msmq.model";
import { MsmqQueueDetailsResponse } from "../../core/models/responses/msmq.model";

@Injectable()
export class MsmqManageService {
  private baseUrl: string = "";
  readonly msmqFunc = 'msmq/';
  readonly searchListFunc = 'SearchList/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  //查詢佇列
  GetAllQueue(req: MsmqQueueInfoRequest): Observable<ResponseModel<MsmqQueueDetailsResponse>> {
    return this.apiService.doSend(HttpMethod.POST, this.baseUrl + this.msmqFunc + this.searchListFunc, req);
  }
}
