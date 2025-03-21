import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileApiService {

  constructor(private http: HttpClient) { }

  // 上傳檔案方法
  uploadFile(url: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${url}`, formData, {
      headers: new HttpHeaders(),
      observe: 'events',
      reportProgress: true
    }).pipe(
      catchError(error => {
        // 處理錯誤
        console.error('檔案上傳失敗', error);
        throw error;
      })
    );
  }

  // 下載檔案方法
  downloadFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError(error => {
        console.error('檔案下載失敗', error);
        return throwError(() => new Error(error.message || '下載失敗，請稍後再試'));
      })
    );
  }


}
