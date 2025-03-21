import { Injectable } from "@angular/core";
import { ApiService } from "../../api/services/api.service";
import { ConfigService } from "../../core/services/config.service";
import { FileApiService } from "../../api/services/file-api.service";

@Injectable()
export class TestManageService {
  private baseUrl: string = "";
  readonly uploadFunc = 'upload/';
  readonly downloadFunc = 'download/';

  constructor(
    private service: ApiService,
    private configService: ConfigService,
    private fileApiService: FileApiService
  ) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });
  }

  uploadFile(selectedFile: File) {
    return this.fileApiService.uploadFile(this.baseUrl + this.uploadFunc, selectedFile);
  }

  downloadFile(fileName: string) {
    return this.fileApiService.downloadFile(this.baseUrl + this.downloadFunc + fileName);
  }
}
