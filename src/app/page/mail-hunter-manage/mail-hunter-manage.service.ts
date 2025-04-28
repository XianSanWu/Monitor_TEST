import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { ConfigService } from "../../core/services/config.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { HttpMethod } from "../../core/enums/http-method";
import { MailHunterSearchListRequest } from "../../core/models/requests/mail-hunter.model";
import { MailHunterSearchResponse } from "../../core/models/responses/mail-hunter.model";
import { FileApiService } from "../../api/services/file-api.service";

@Injectable()
export class MailHunterManageService {
  private baseUrl: string = "";
  readonly MHUFunc = 'MailHunter/';
  readonly projectMailCountSearchListFunc = 'ProjectMailCountSearchList/';
  readonly exportProjectMailCountCSVFunc = 'ExportProjectMailCountCSV/';

  constructor(
    private apiService: ApiService,
    private fileService: FileApiService,
    private configService: ConfigService,
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  //專案寄件數查詢
  GetProjectMailCountList(req: MailHunterSearchListRequest): Observable<ResponseModel<MailHunterSearchResponse>> {
    return this.apiService.doSend(HttpMethod.POST, this.baseUrl + this.MHUFunc + this.projectMailCountSearchListFunc, req);
  }

  //匯出 專案寄件數查詢
  ExportProjectMailCountCSV(req: MailHunterSearchListRequest, fileName: string): Observable<Blob> {
    return this.fileService.downloadFile(this.baseUrl + this.MHUFunc + this.exportProjectMailCountCSVFunc, req, fileName);
  }
}
