import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, finalize, switchMap, takeUntil, tap } from 'rxjs';
import { TokenService } from '../../../api/services/token.service';
import { Base64Util } from '../../../common/utils/base64-util';
import { CryptoUtil } from '../../../common/utils/crypto-util';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { PageBase } from '../../../core/models/common/base.model';
import { LoginRequest } from '../../../core/models/requests/login.model';
import { FieldModel } from '../../../core/models/requests/permission-model';
import { UserRequest } from '../../../core/models/requests/user-model';
import { ConfigService } from '../../../core/services/config.service';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { BaseComponent } from '../../base.component';
import { PermissionManageService } from '../../permission-manage/permission-manage.service';
import { AuthManageService } from '../auth-manage.service';

@Component({
  selector: 'login-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicInputComponent,
    LoadingIndicatorComponent,
  ],
  providers: [AuthManageService, PermissionManageService],
  templateUrl: './auth-login-verify.component.html',
  styleUrl: './auth-login-verify.component.scss',
})
export default class LoginComponent extends BaseComponent {
  validateForm!: FormGroup;
  key!: string;
  iv!: string;
  isApiFinish: boolean = true;

  constructor(
    private router: Router,
    private AuthManageService: AuthManageService,
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService,
    private configService: ConfigService,
    private dialogService: DialogService,
    private tokenService: TokenService,
    private permissionManageService: PermissionManageService
  ) {
    super();
    this.validateForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        ValidatorsUtil.blank,
        ValidatorsUtil.intSymbolsEnglishNumbers,
      ]),
      password: new FormControl('', [
        Validators.required,
        ValidatorsUtil.blank,
        ValidatorsUtil.intSymbolsEnglishNumbers,
      ]),
    });

    this.configService.configData$.subscribe((data) => {
      this.key = data?.EncryptionSettings?.[0];
      this.iv = data?.EncryptionSettings?.[1];
    });
  }

  submit() {
  if (!this.isApiFinish) {
    return;
  }
  this.isApiFinish = false;

  if (this.validateForm.invalid) {
    this.isApiFinish = true;
    return; // Form is invalid, exit early.
  }

  let reqData: LoginRequest = this.validateForm.getRawValue();
  reqData.password = Base64Util.encode(
    CryptoUtil.encrypt(reqData.password, this.key, this.iv)
  );

  this.loadingService.show();

  this.AuthManageService.login(reqData)
    .pipe(
      catchError((err) => {
        this.localStorageService.clear();
        this.dialogService.openCustomSnackbar({
          message: err.message || '登入時發生錯誤',
        });
        throw err;
      }),
      switchMap((res) => {
        if (!res?.Data?.IsLogin) {
          this.dialogService.openCustomSnackbar({
            message: '驗證失敗，請輸入正確帳號密碼',
          });
          throw new Error('Login failed');
        }

        // AccessToken 已改為 HttpOnly cookie，前端無需存取
        // 保留 TokenUuid 供前端查權限使用
        if (!res?.Data?.TokenUuid) {
          this.dialogService.openCustomSnackbar({
            message: '登入失敗，無正確 TokenUuid 回應',
          });
          throw new Error('Invalid TokenUuid');
        }
        this.tokenService.setTokenUuid(res.Data.TokenUuid);
        this.localStorageService.setItem('isLoggedIn', reqData.username);

        // 準備權限查詢請求
        const pageBaseBig = new PageBase({
          pageSize: 2147483647,
          pageIndex: 1,
          totalCount: 0,
        });
        const userReq: UserRequest = {
          page: pageBaseBig,
          sortModel: undefined,
          filterModel: undefined,
          fieldModel: new FieldModel({
            TokenUuid: this.tokenService.getTokenUuid()?.toString(),
          }),
        };

        // 呼叫權限 API
        return this.permissionManageService.GetUserPermissionsMenuAsync(userReq);
      }),
      tap((permRes) => {
        if (!!permRes?.Data) {
          this.localStorageService.setItem(
            'userPermissionsMenu',
            JSON.stringify(permRes.Data)
          );
        } else {
          this.dialogService.openCustomSnackbar({
            message: '無法取得使用者權限',
          });
        }
      }),
      finalize(() => {
        this.isApiFinish = true;
        this.loadingService.hide();
      }),
      takeUntil(this.destroy$)
    )
    .subscribe({
      next: () => {
        // 權限完成後再跳轉
        this.router.navigate(['/home']);
      },
      error: () => {
        this.isApiFinish = true;
        this.loadingService.hide();
      }
    });
}

  // 監聽 Enter 鍵
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (this.validateForm.invalid) {
      return;
    }

    this.submit();
  }
}
