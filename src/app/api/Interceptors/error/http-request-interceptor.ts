import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take, timeout } from 'rxjs/operators';
import { DialogService } from '../../../core/services/dialog.service';
import { AuthManageService } from '../../../page/auth-manage/auth-manage.service';

const REQUEST_TIMEOUT = 300_000;

let isRefreshing = false;
let refreshSubject: Subject<boolean> = new Subject<boolean>();

export const httpRequestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authManageService = inject(AuthManageService);
  const dialogService = inject(DialogService);
  const router = inject(Router);

  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq).pipe(
    timeout(REQUEST_TIMEOUT),
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshSubject = new Subject<boolean>();

          return authManageService.refreshToken().pipe(
            switchMap((res) => {
              // 假設後端 ResultResponse<boolean> 失敗時 res.Status != 1
              if (!res.Status) {
                dialogService.openCustomSnackbar({
                  message: '登入過期，請重新登入',
                });
                router.navigate(['/login']);
                return throwError(() => new Error('登入過期，請重新登入'));
              }

              // 如果 refresh 成功，retry 原 request
              const retryReq = req.clone({ withCredentials: true });
              dialogService.openCustomSnackbar({ message: '已自動登入並換發Token' });
              return next(retryReq);
            }),
            catchError(() => {
              // dialogService.openCustomSnackbar({
              //   message: '登入過期，請重新登入',
              // });
              router.navigate(['/login']);
              return throwError(() => new Error('登入過期，請重新登入'));
            })
          );
        } else {
          // 等待正在進行的 refresh 結果再 retry
          return refreshSubject.pipe(
            filter((success) => success === true),
            take(1),
            switchMap(() => next(req.clone({ withCredentials: true })))
          );
        }
      }

      // 逾時/500/403 錯誤處理
      let errorMessage = '發生未知錯誤';
      let isShow = true;

      if (err.name === 'TimeoutError') {
        errorMessage = '⏳ 請求逾時，請稍後再試！';
        router.navigate(['/']);
      } else if (err instanceof HttpErrorResponse) {
        if (err.status === 500) isShow = false;
        else if (err.status === 403) {
          isShow = false;
          errorMessage = '無此功能';
          router.navigate(['/login']);
        } else {
          errorMessage = `❌ 錯誤代碼: ${err.status}，${err.message}`;
        }
      }

      if (isShow) {
        dialogService.openCustomSnackbar({ message: errorMessage });
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
