import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api/services/api.service';
import { HttpMethod } from '../../core/enums/http-method';
import { ResponseModel } from '../../core/models/base.model';
import { AuditSearchListRequest } from '../../core/models/requests/audit.model';
import { AuditSearchResponse } from '../../core/models/responses/audit.model';
import { ConfigService } from '../../core/services/config.service';

@Injectable()
export class AuditManageService {
  private baseUrl: string = '';
  readonly auditFunc = 'audit/';
  readonly searchListFunc = 'SearchList/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService
  ) {
    this.configService.configData$.subscribe((data) => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  //查詢稽核軌跡
  GetAllAudit(
    req: AuditSearchListRequest
  ): Observable<ResponseModel<AuditSearchResponse>> {
    return this.apiService.doSend(
      HttpMethod.POST,
      this.baseUrl + this.auditFunc + this.searchListFunc,
      req
    );
  }
}
