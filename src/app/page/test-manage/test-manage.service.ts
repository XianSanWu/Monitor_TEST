import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { ConfigService } from "../../core/services/config.service";
import { FileApiService } from "../../api/services/file-api.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { WorkflowStepsSearchResponse } from "../../core/models/responses/workflow-steps.model";
import { HttpMethod } from "../../core/enums/http-method";
import { WorkflowStepsSearchListRequest } from "../../core/models/requests/workflow-steps.model";

@Injectable()
export class TestManageService {
  private baseUrl: string = "";
  readonly uploadFunc = 'upload/';
  readonly downloadFunc = 'download/';
  readonly workflowStepsFunc = 'WorkflowSteps/'
  readonly searchListFunc = 'SearchList/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
    private fileApiService: FileApiService
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }



  getSearchList(req: WorkflowStepsSearchListRequest): Observable<ResponseModel<WorkflowStepsSearchResponse>> {
    return this.apiService.doSend(HttpMethod.POST, this.baseUrl + this.workflowStepsFunc + this.searchListFunc, req);
  }

  uploadFile(selectedFile: File) {
    return this.fileApiService.uploadFile(this.baseUrl + this.uploadFunc, selectedFile);
  }

  // downloadFile(fileName: string) {
  //   return this.fileApiService.downloadFile(this.baseUrl + this.downloadFunc + fileName);
  // }
}
