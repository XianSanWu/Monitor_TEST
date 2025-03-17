import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ConfigService } from '../../core/services/config.service';
import { ResponseModel } from '../../core/models/base.model';

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private baseUrl: string = "";

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configService.configData$.subscribe(data => {
      this.baseUrl = data?.SERVER_URL + data?.API_URL;
    });

  }

  // 預設 HTTP headers
  private defaultHeaders = new HttpHeaders({
    // 'Content-Type': 'application/json; charset=UTF-8',
    // 'Access-Control-Allow-Origin': '*',
  });


  doSend<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    body?: any,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<ResponseModel<T>> {

    let requestHeaders = headers ? headers : this.defaultHeaders;

    let request: Observable<any>;
    url = this.baseUrl + url;
    switch (method) {
      case 'get':
        request = this.http.get<ResponseModel<T>>(url, { headers: requestHeaders, params });
        break;
      case 'post':
        request = this.http.post<ResponseModel<T>>(url, body, { headers: requestHeaders });
        break;
      case 'put':
        request = this.http.put<ResponseModel<T>>(url, body, { headers: requestHeaders });
        break;
      case 'delete':
        request = this.http.delete<ResponseModel<T>>(url, { headers: requestHeaders, body });
        break;
      default:
        throw new Error('Unsupported HTTP method');
    }

    return request.pipe(catchError((error) => this.handleError(error)));
  }

  // 處理錯誤
  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message || 'An error occurred'));
  }
}
