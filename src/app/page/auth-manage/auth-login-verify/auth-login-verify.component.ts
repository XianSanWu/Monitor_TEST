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
import { RestStatus } from '../../../common/enums/rest-enum';
import { BaseComponent } from '../../base.component';

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

  constructor(
    private router: Router,
    private AuthManageService: AuthManageService,
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService,
    private dialogService: DialogService
  ) {
    super();
    this.validateForm = new FormGroup({
      username: new FormControl('', [Validators.required, ValidatorsUtil.blank, ValidatorsUtil.intSymbolsEnglishNumbers]),
      password: new FormControl('', [Validators.required, ValidatorsUtil.blank, ValidatorsUtil.intSymbolsEnglishNumbers]),
    });
  }

  submit() {
    const reqData: LoginRequest = this.validateForm.getRawValue();
    if (this.validateForm.invalid) {
      return; // Form is invalid, exit early.
    }

    this.loadingService.show();
    this.AuthManageService.login(reqData).pipe(
      catchError((err) => {
        this.localStorageService.clear();
        this.dialogService.openCustomSnackbar({
          message: err.message || 'An error occurred during login.'
        });
        throw Error(err.message);
      }),
      tap(res => {
        if(res.Status?.toString() !== RestStatus.SUCCESS){
          this.dialogService.openCustomSnackbar({
            message: res.Message
          });
          return;
        }

        if (res) {
          this.localStorageService.setItem('isLoggedIn', reqData.username);
          this.router.navigate(['/home']);
        }
      }),
      takeUntil(this.destroy$),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe();
  }

  // 監聽 Enter 鍵
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    this.submit();
  }
}
