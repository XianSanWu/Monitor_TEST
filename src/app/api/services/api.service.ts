import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { HttpMethod } from '../../core/enums/http-method';
import { RestStatus } from '../../core/enums/rest-enum';
import { ResponseModel } from '../../core/models/base.model';
import { AuditActionService } from '../../core/services/audit-action.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private auditAction: AuditActionService
  ) {}

  doSend<T>(
    method:
      | HttpMethod.GET
      | HttpMethod.POST
      | HttpMethod.PUT
      | HttpMethod.DELETE,
    url: string,
    body?: any,
    params?: HttpParams,
    options?: { withCredentials?: boolean } // 新增參數
  ): Observable<ResponseModel<T>> {
    let request: Observable<any>;
    let errorMsg: { message: string } = { message: '' };

    const lastAction = this.auditAction.get();
    console.log('lastAction', lastAction);
    
    const headers = lastAction
      ? {
          'X-FrontUrl': window.location.href,
          'X-ActionName': encodeURIComponent(lastAction.name),
          'X-ActionId': lastAction.uuid,
        }
      : { 'X-FrontUrl': window.location.href };

    console.log('headers', headers);

    const httpOptions: any = {
      params,
      withCredentials: options?.withCredentials ?? true,
      headers: headers,
    };

    switch (method) {
      case HttpMethod.GET:
        request = this.http.get<ResponseModel<T>>(url, httpOptions);
        break;
      case HttpMethod.POST:
        request = this.http.post<ResponseModel<T>>(url, body, httpOptions);
        break;
      case HttpMethod.PUT:
        request = this.http.put<ResponseModel<T>>(url, body, httpOptions);
        break;
      case HttpMethod.DELETE:
        request = this.http.delete<ResponseModel<T>>(url, {
          ...httpOptions,
          body,
        });
        break;
      default:
        throw new Error('不支援的 HTTP 方法');
    }

    return request.pipe(
      take(1),
      map((res: ResponseModel<T>) => {
        if (!this.handleApiResponse(res, errorMsg)) {
          throw new Error(errorMsg.message);
        }
        return res;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  // 處理 API 回應邏輯
  private handleApiResponse<T>(
    res: ResponseModel<T>,
    errorMsg: { message: string }
  ): boolean {
    if (res?.Status?.toString() !== RestStatus.SUCCESS) {
      errorMsg.message = res.Message; // 修改 message 屬性
      return false;
    }

    const errors = (res.Data as { errors?: { [key: string]: string[] } })
      ?.errors;
    if (errors) {
      let allMessages: string[] = [];

      Object.keys(errors).forEach((key) => {
        const messages = errors[key];
        allMessages.push(...messages);
      });

      errorMsg.message = allMessages.join('\n'); // 修改 message 屬性

      return false;
    }

    return true;
  }

  // 處理錯誤
  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || '發生錯誤'));
  }
}
