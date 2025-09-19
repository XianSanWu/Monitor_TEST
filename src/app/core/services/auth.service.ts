import { Injectable } from '@angular/core';

import { AuthManageService } from '../../page/auth-manage/auth-manage.service';

import { DialogService } from './dialog.service';

import { catchError, finalize, takeUntil, tap } from 'rxjs';

import { LoadingService } from './loading.service';

import { Router } from '@angular/router';

import { BaseComponent } from '../../page/base.component';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseComponent {
  constructor(
    private sessionStorageService: SessionStorageService,

    private loadingService: LoadingService,

    private router: Router,

    private authManageService: AuthManageService,

    private dialogService: DialogService
  ) {
    super();
  }

  logout(): void {
    this.loadingService.show();

    this.sessionStorageService.clear();

    this.authManageService
      .logout()

      .pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message + '登出失敗',
          });

          throw Error(err.message);
        }),

        tap((res) => {
          this.dialogService.openCustomSnackbar({
            title: '提示訊息',

            message: '登出成功',
          });
        }),

        takeUntil(this.destroy$),

        finalize(() => {
          this.router.navigate(['/login']);

          this.loadingService.hide();
        })
      )
      .subscribe();
  }

  hasPermission(module: string, feature: string, action?: string): boolean {
    const permissions = JSON.parse(
      this.sessionStorageService.getItem('userPermissionsMenu') ?? '[]'
    );

    // console.log('permissions',permissions)

    const result = permissions.some(
      (p: any) =>
        p.IsUse &&
        p.ModuleName.toLowerCase() === module.toLowerCase() &&
        p.FeatureName.toLowerCase() === feature.toLowerCase() &&
        (action ? p.Action?.toLowerCase() === action.toLowerCase() : true)
    );

    // console.log('result',result)

    return result;
  }
}
