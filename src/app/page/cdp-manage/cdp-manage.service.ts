import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { ConfigService } from "../../core/services/config.service";
import { FileApiService } from "../../api/services/file-api.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { SearchResponse } from "../../core/models/responses/test1.model";

@Injectable()
export class CdpManageService {
  private baseUrl: string = "";
  readonly workflowStepsFunc = 'workflowsteps/'
  readonly searchListFunc = 'searchList/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  //查詢工作流程管理
  getSearchList(req: any): Observable<ResponseModel<SearchResponse>> {
    return this.apiService.doSend("post", this.baseUrl + this.workflowStepsFunc + this.searchListFunc, req);
  }

}
