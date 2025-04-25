import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { ConfigService } from "../../core/services/config.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { HttpMethod } from "../../core/enums/http-method";
import { MailHunterSearchListRequest } from "../../core/models/requests/mail-hunter.model";
import { MailHunterSearchResponse } from "../../core/models/responses/mail-hunter.model";

@Injectable()
export class MailHunterManageService {
  private baseUrl: string = "";
  readonly MHUFunc = 'MailHunter/';
  readonly projectMailCountSearchListFunc = 'ProjectMailCountSearchList/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  GetProjectMailCountList(req: MailHunterSearchListRequest): Observable<ResponseModel<MailHunterSearchResponse>> {
    return this.apiService.doSend(HttpMethod.POST, this.baseUrl + this.MHUFunc + this.projectMailCountSearchListFunc, req);
  }
}
