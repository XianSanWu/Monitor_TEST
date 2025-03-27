import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, tap, timeout } from 'rxjs/operators';
import { DialogService } from '../../core/services/dialog.service';

const REQUEST_TIMEOUT = 180000; // 設定 180 秒逾時

export const httpRequestInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const dialogService = inject(DialogService);
  // console.log(`🔵 發送請求: ${req.method} ${req.url}`);

  return next(req).pipe(
    timeout(REQUEST_TIMEOUT), // 設定請求逾時
    tap(event => {
      // if (event instanceof HttpResponse) {
      //   console.log(`✅ HTTP ${event.status} 成功`, event);
      // }
    }),
    catchError(error => {
      let errorMessage = '發生未知錯誤';

      if (error instanceof TimeoutError) {
        errorMessage = '⏳ 請求逾時，請稍後再試！';
      } else if (error instanceof HttpErrorResponse) {
        errorMessage = `❌錯誤代碼: ${error.status}，${error.message}`;
      }

      // 使用 DialogService 顯示錯誤訊息
      dialogService.openCustomSnackbar(errorMessage);

      return throwError(() => new Error(errorMessage));
    })
  );
};
