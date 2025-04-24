import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { ResponseModel } from '../../core/models/base.model';
import { RestStatus } from '../../core/enums/rest-enum';
import { HttpMethod } from '../../core/enums/http-method';

@Injectable({
  providedIn: 'root',
})

export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  // 預設 HTTP headers
  private defaultHeaders = new HttpHeaders({
    // 'Content-Type': 'application/json; charset=UTF-8',
    // 'Access-Control-Allow-Origin': '*',
  });

  doSend<T>(
    method: HttpMethod.GET | HttpMethod.POST | HttpMethod.PUT | HttpMethod.DELETE,
    url: string,
    body?: any,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<ResponseModel<T>> {

    let requestHeaders = headers ? headers : this.defaultHeaders;
    let request: Observable<any>;
    let errorMsg: { message: string } = { message: '' };  // 用對象包裝錯誤訊息

    switch (method) {
      case HttpMethod.GET:
        request = this.http.get<ResponseModel<T>>(url, { headers: requestHeaders, params });
        break;
      case HttpMethod.POST:
        request = this.http.post<ResponseModel<T>>(url, body, { headers: requestHeaders });
        break;
      case HttpMethod.PUT:
        request = this.http.put<ResponseModel<T>>(url, body, { headers: requestHeaders });
        break;
      case HttpMethod.DELETE:
        request = this.http.delete<ResponseModel<T>>(url, { headers: requestHeaders, body });
        break;
      default:
        throw new Error('不支援的 HTTP 方法');
    }

    // 處理回應並進行錯誤處理
    return request.pipe(
      take(1),
      map((res: ResponseModel<T>) => {
        if (!this.handleApiResponse(res, errorMsg)) {
          throw new Error(errorMsg.message);  // 使用對象的 message 屬性
        }
        return res; // 正常回傳資料
      }),
      catchError((error) => this.handleError(error)) // 處理 HTTP 錯誤
    );
  }

  // 處理 API 回應邏輯
  private handleApiResponse<T>(res: ResponseModel<T>, errorMsg: { message: string }): boolean {
    if (res?.Status?.toString() !== RestStatus.SUCCESS) {
      errorMsg.message = res.Message;  // 修改 message 屬性
      return false;
    }

    const errors = (res.Data as { errors?: { [key: string]: string[] } })?.errors;
    if (errors) {
      let allMessages: string[] = [];

      Object.keys(errors).forEach((key) => {
        const messages = errors[key];
        allMessages.push(...messages);
      });

      errorMsg.message = allMessages.join('\n');  // 修改 message 屬性

      return false;
    }

    return true;
  }

  // 處理錯誤
  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || '發生錯誤'));
  }
}
