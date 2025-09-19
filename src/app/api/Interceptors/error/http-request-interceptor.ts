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
import {
  catchError,
  filter,
  finalize,
  switchMap,
  take,
  timeout,
} from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { AuthManageService } from '../../../page/auth-manage/auth-manage.service';

const REQUEST_TIMEOUT = 300_000;
let isRefreshing = false;
let refreshSubject: Subject<boolean> = new Subject<boolean>();

// 全局錯誤 Subject

const errorNotifier = new Subject<{ type: string; message: string }>();
const errorFlags: Record<string, boolean> = {};

export const httpRequestInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,

  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authManageService = inject(AuthManageService);
  const authService = inject(AuthService);
  // const sessionStorageService = inject(SessionStorageService);
  const router = inject(Router);
  const dialogService = inject(DialogService);
  const loadingService = inject(LoadingService);

  // 訂閱錯誤通知（在第一次 interceptor 被呼叫時才訂閱）

  errorNotifier.pipe(filter((msg) => !!msg?.message)).subscribe((msg) => {
    if (!errorFlags[msg.type]) {
      errorFlags[msg.type] = true;

      dialogService.openCustomSnackbar({ message: msg.message });

      // 假設 snackbar 自動消失 3 秒後重置 flag

      setTimeout(() => {
        errorFlags[msg.type] = false;
      }, 3000);
    }
  });

  const clonedReq = req.clone({ withCredentials: true });

  return next(clonedReq).pipe(
    timeout(REQUEST_TIMEOUT),

    catchError((err) => {
      // 401 處理

      if (err instanceof HttpErrorResponse && err.status === 401) {
        if (!isRefreshing) {
          loadingService.hide();

          isRefreshing = true;

          refreshSubject = new Subject<boolean>();

          dialogService.openConfirmDialog({
            title: '登入已過期',

            content: '是否要繼續保持登入狀態？',

            leftButtonName: '登出',

            rightButtonName: '繼續登入',

            // ❌ 登出

            leftCallback: () => {
              // sessionStorageService.clear();

              // router.navigate(['/login']);

              refreshSubject.error(new Error('使用者選擇登出'));

              refreshSubject.complete();

              isRefreshing = false;

              authService.logout();
            },

            // ✅ 繼續登入

            rightCallback: () => {
              authManageService
                .refreshToken()
                .pipe(
                  switchMap((res) => {
                    if (!res.Status) {
                      authService.logout();

                      refreshSubject.error(new Error('登入過期，請重新登入'));

                      return throwError(() => new Error('refresh token 失敗'));
                    }

                    refreshSubject.next(true);

                    refreshSubject.complete();

                    return next(req.clone({ withCredentials: true }));
                  }),

                  catchError(() => {
                    // sessionStorageService.clear();

                    // router.navigate(['/login']);

                    refreshSubject.error(new Error('refresh token 失敗'));

                    authService.logout();

                    return throwError(() => new Error('refresh token 失敗'));
                  }),

                  finalize(() => {
                    isRefreshing = false;
                  })
                )
                .subscribe();
            },
          });

          // 等 refreshSubject 完成後再 retry

          return refreshSubject.pipe(
            filter((success) => success === true),

            take(1),

            switchMap(() => next(req.clone({ withCredentials: true })))
          );
        } else {
          return refreshSubject.pipe(
            filter((success) => success === true),

            take(1),

            switchMap(() => next(req.clone({ withCredentials: true })))
          );
        }
      }

      // 逾時 / 500 / 403 / 其他錯誤

      let errorType = 'unknown';

      let errorMessage = '發生未知錯誤';

      if (err.name === 'TimeoutError') {
        errorType = 'timeout';

        errorMessage = '⏳ 請求逾時，請稍後再試！';

        router.navigate(['/']);
      } else if (err instanceof HttpErrorResponse) {
        if (err.status === 500) {
          errorType = '500';

          errorMessage = `❌ 伺服器錯誤: ${err.message}`;
        } else if (err.status === 403) {
          errorType = '403';

          errorMessage = '請檢視是否有權限 或 權限異動';

          authService.logout();
        } else if (err.status === 409) {
          errorType = '409';

          errorMessage = '其他帳號登入，無法重複登入';

          authService.logout();
        } else {
          errorType = String(err.status);

          errorMessage = `❌ 錯誤代碼: ${err.status}，${err.message}`;
        }
      }

      errorNotifier.next({ type: errorType, message: errorMessage });

      return throwError(() => err);
    })
  );
};
