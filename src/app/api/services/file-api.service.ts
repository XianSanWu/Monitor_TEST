import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuditActionService } from '../../core/services/audit-action.service';
@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  constructor(
    private http: HttpClient,
    private auditAction: AuditActionService
  ) {}

  // 上傳檔案方法
  uploadFile(url: string, file: File): Observable<any> {
    const formData = new FormData();

    formData.append('file', file);

    return this.http
      .post(`${url}`, formData, {
        headers: new HttpHeaders(),
        observe: 'events',
        reportProgress: true,
      })
      .pipe(
        catchError((error) => {
          // 處理錯誤
          console.error('檔案上傳失敗', error);
          throw error;
        })
      );
  }

  /**
   * 用來下載檔案的共用方法
   * @param url 檔案的 URL
   * @param fileName 要下載的檔案名稱
   */
  downloadFile(url: string, body: any, fileName: string): Observable<Blob> {
    // let requestHeaders = new HttpHeaders({
    //   'Content-Type': 'file', //隨便定義，為了不要讓後端AuditMiddleware抓到
    // });
    const lastAction = this.auditAction.get();
    // console.log('lastAction', lastAction);

    const requestHeaders = lastAction
      ? new HttpHeaders({
          'IsFile': 'true', //隨便定義，為了不要讓後端AuditMiddleware抓到
          'X-FrontUrl': window.location.href,
          'X-ActionName': encodeURIComponent(lastAction.name),
          'X-ActionId': lastAction.uuid,
        })
      : new HttpHeaders({
          'IsFile': 'true', //隨便定義，為了不要讓後端AuditMiddleware抓到
          'X-FrontUrl': window.location.href,
        });

    // 設定查詢參數
    let params = new HttpParams();
    params = params.set('fileName', fileName);

    return this.http
      .post(url, body, {
        headers: requestHeaders,
        responseType: 'blob',
        params,
      })
      .pipe(
        map((response: Blob) => {
          // console.log('response',response)
          // 用 Blob 資料創建 URL
          const downloadUrl = window.URL.createObjectURL(response);
          const link = document.createElement('a');

          link.href = downloadUrl;
          link.download = fileName; // 使用傳遞的 fileName 作為下載檔案的名稱
          link.click();
          window.URL.revokeObjectURL(downloadUrl); // 清理 URL

          return response; // 返回 Blob 資料
        }),

        catchError((error) => {
          console.error('檔案下載失敗', error);

          throw new Error(error.message || '下載失敗，請稍後再試');
        })
      );
  }
}
