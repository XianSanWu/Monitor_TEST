import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { AuthManageService } from '../auth-manage.service';
import { catchError, finalize, takeUntil, tap } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LoginRequest } from '../../../core/models/requests/login.model';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { DialogService } from '../../../core/services/dialog.service';
import { BaseComponent } from '../../base.component';
import { Base64Util } from '../../../common/utils/base64-util';
import { ConfigService } from '../../../core/services/config.service';
import { CryptoUtil } from '../../../common/utils/crypto-util';

@Component({
  selector: 'login-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicInputComponent,
    LoadingIndicatorComponent,
  ],
  providers: [LoadingService, AuthManageService],
  templateUrl: './auth-login-verify.component.html',
  styleUrl: './auth-login-verify.component.scss'
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
    private dialogService: DialogService
  ) {
    super();
    this.validateForm = new FormGroup({
      username: new FormControl('', [Validators.required, ValidatorsUtil.blank, ValidatorsUtil.intSymbolsEnglishNumbers]),
      password: new FormControl('', [Validators.required, ValidatorsUtil.blank, ValidatorsUtil.intSymbolsEnglishNumbers]),
    });

    this.configService.configData$.subscribe(data => {
      this.key = data?.EncryptionSettings?.AESKey;
      this.iv = data?.EncryptionSettings?.AESIV;
    });
  }

  submit() {
    if (!this.isApiFinish) {
      return;
    }
    this.isApiFinish = false;

    let reqData: LoginRequest = this.validateForm.getRawValue();
    if (this.validateForm.invalid) {
      return; // Form is invalid, exit early.
    }
    reqData.password = Base64Util.encode(CryptoUtil.encrypt(reqData.password, this.key, this.iv));

    this.loadingService.show();
    this.AuthManageService.login(reqData).pipe(
      catchError((err) => {
        this.localStorageService.clear();
        this.dialogService.openCustomSnackbar({
          message: err.message || '登入時發生錯誤'
        });
        throw Error(err.message);
      }),
      tap(res => {
        if (!res?.Data) {
          this.dialogService.openCustomSnackbar({
            message: '驗證失敗，請輸入正確帳號密碼'
          });
          return;
        }

        this.localStorageService.setItem('isLoggedIn', reqData.username);
        this.router.navigate(['/home']);
      }),
      takeUntil(this.destroy$),
      finalize(() => {
        this.isApiFinish = true;
        this.loadingService.hide();
      })
    ).subscribe();
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
