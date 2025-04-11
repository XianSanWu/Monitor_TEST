import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { ConfigService } from "../../core/services/config.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { WorkflowStepsKafkaRequest, WorkflowStepsSearchListRequest } from "../../core/models/requests/workflow-steps.model";
import { WorkflowStepsSearchResponse, WorkflowStepsKafkaResponse } from "../../core/models/responses/workflow-steps.model";
import { HttpMethod } from "../../core/enums/http-method";

@Injectable()
export class CdpManageService {
  private baseUrl: string = "";
  readonly workflowStepsFunc = 'WorkflowSteps/'
  readonly searchListFunc = 'SearchList/';
  readonly getKafkaLagFunc = 'GetKafkaLag/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  //查詢工作流程管理
  getSearchList(req: WorkflowStepsSearchListRequest): Observable<ResponseModel<WorkflowStepsSearchResponse>> {
    return this.apiService.doSend(HttpMethod.POST, this.baseUrl + this.workflowStepsFunc + this.searchListFunc, req);
  }

  //取得卡夫卡工作量
  GetKafkaLag(req: WorkflowStepsKafkaRequest): Observable<ResponseModel<WorkflowStepsKafkaResponse>> {
    return this.apiService.doSend(HttpMethod.POST, this.baseUrl + this.workflowStepsFunc + this.getKafkaLagFunc, req);
  }

}
