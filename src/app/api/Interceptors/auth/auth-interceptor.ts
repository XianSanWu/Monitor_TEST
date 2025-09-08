// import {
//   HttpEvent,
//   HttpHandlerFn,
//   HttpInterceptorFn,
//   HttpRequest,
// } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { catchError, Observable, switchMap, throwError } from 'rxjs';
// import { DialogService } from '../../../core/services/dialog.service';
// import { AuthManageService } from '../../../page/auth-manage/auth-manage.service';

// export const authInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<any>,
//   next: HttpHandlerFn
// ): Observable<HttpEvent<any>> => {
//   const authManageService = inject(AuthManageService);
//   const dialogService = inject(DialogService);
//   const router = inject(Router);

//   // 帶 cookie
//   const clonedReq = req.clone({ withCredentials: true });

//   return next(clonedReq).pipe(
//     catchError((err) => {
//       if (err.status === 401) {
//         // 用 enum
//         return authManageService.refreshToken().pipe(
//           switchMap(() => {
//             // 重新發送原本的 request
//             const retryReq = req.clone({ withCredentials: true });
//             dialogService.openCustomSnackbar({ message: '已自動換發ToKen' });
//             return next(retryReq);
//           }),
//           catchError(() => {
//             router.navigate(['/login']);
//             dialogService.openCustomSnackbar({ message: '登入過期，請重新登入' });
//             return throwError(() => new Error('登入過期，請重新登入'));
//           })
//         );
//       }
//       return throwError(() => err);
//     })
//   );
// };
