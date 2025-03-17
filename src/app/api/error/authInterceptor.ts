// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { catchError, tap } from 'rxjs/operators';
// import { RestStatus } from '@common/enums/rest-enum';
// import { DialogService } from '@api/services/dialog.service';
// import { StorageService } from '@api/services/storage.service';
// import { LoadingService } from '@api/services/loading.service';
// import { Router } from '@angular/router';
// import { ApiService } from '@api/services/api.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   constructor(
//     private dialogService: DialogService,
//     private loadingService: LoadingService,
//     private router: Router,
//     private storageService: StorageService,
//     private apiService: ApiService
//   ) { }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     return next.handle(request).pipe(
//       tap(event => {
//         if (event instanceof HttpResponse) {
//           if (event.headers.has('authorization')) {
//             this.storageService.putSessionVal('jwtToken', event.headers.get('authorization'));
//             this.apiService.jwtToken = event.headers.get('authorization');
//           }
//         }
//       }),
//       catchError((error: HttpErrorResponse) => {
//         if (error && (error.status?.toString() === RestStatus.UNAUTHORIZED || error.status?.toString() === RestStatus.FORBIDDEN)) {
//           this.openTimeoutError(error);
//           this.checkPermissions(error)
//         }
//         throw error;
//       })
//     );
//   }

//   openTimeoutError(error?: HttpErrorResponse, code?: string) {
//     if ((error && error.status.toString() === RestStatus.UNAUTHORIZED) || (code && code.toString() === RestStatus.UNAUTHORIZED)) {
//       if (this.storageService.getSessionVal("jwtToken")) {
//         this.storageService.clear();
//       }

//       this.dialogService.alertAndBackToList(error.status, false, '逾時操作');

//       setTimeout(() => {
//         let dialogOption = { title: '逾時操作', btnName: '關 閉' };
//         this.loadingService.close();
//         this.dialogService.openTimeout(dialogOption);
//       }, 0)
//     }
//   }

//   checkPermissions(error?: HttpErrorResponse, code?: string) {
//     if ((error && error.status.toString() === RestStatus.FORBIDDEN) || (code && code.toString() === RestStatus.FORBIDDEN)) {
//       this.dialogService.alertAndBackToList(error.status * 10, false, '權限不足');//乘10只是為了躲避不顯示的邏輯
//       if (this.storageService.getSessionVal("jwtToken")) {
//         this.storageService.clear();
//       }
//       setTimeout(() => {
//         this.router.navigate(['']);
//       }, 2000);
//     }
//   }

// }
