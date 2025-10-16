import { Injectable } from '@angular/core';
import { ApiService } from '../../api/services/api.service';
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

  //查詢佇列
//   GetAllQueue(
//     req: MsmqQueueInfoRequest
//   ): Observable<ResponseModel<MsmqQueueDetailsResponse>> {
//     return this.apiService.doSend(
//       HttpMethod.POST,
//       this.baseUrl + this.msmqFunc + this.searchListFunc,
//       req
//     );
//   }
}
