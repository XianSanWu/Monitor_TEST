import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { ConfigService } from "../../core/services/config.service";
import { Observable } from "rxjs";
import { ResponseModel } from "../../core/models/base.model";
import { HttpMethod } from "../../core/enums/http-method";

@Injectable()
export class MailHunterManageService {
  private baseUrl: string = "";
  readonly searchListFunc = 'SearchList/';

  constructor(
    private apiService: ApiService,
    private configService: ConfigService,
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }


}
