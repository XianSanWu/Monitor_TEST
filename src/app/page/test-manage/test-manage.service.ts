import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { ConfigService } from "../../core/services/config.service";
import { FileApiService } from "../../api/services/file-api.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { SearchResponse } from "../../core/models/responses/test1.model";

@Injectable()
export class TestManageService {
  private baseUrl: string = "";
  readonly uploadFunc = 'upload/';
  readonly downloadFunc = 'download/';
  readonly workflowStepsFunc = 'workflowsteps/'
  readonly searchListFunc = 'searchList/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
    private fileApiService: FileApiService
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }



  getSearchList(req: any): Observable<ResponseModel<SearchResponse>> {
    return this.apiService.doSend("post", this.baseUrl + this.workflowStepsFunc + this.searchListFunc, req);
  }

  uploadFile(selectedFile: File) {
    return this.fileApiService.uploadFile(this.baseUrl + this.uploadFunc, selectedFile);
  }

  downloadFile(fileName: string) {
    return this.fileApiService.downloadFile(this.baseUrl + this.downloadFunc + fileName);
  }
}
