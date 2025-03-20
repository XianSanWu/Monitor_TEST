import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { LoginManageService } from '../login-manage.service';
import { catchError, filter, finalize, tap, of } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LoginRequest } from '../../../core/models/requests/login.model';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { DialogService } from '../../../core/services/dialog.service';
import { RestStatus } from '../../../common/enums/rest-enum';

@Component({
  selector: 'login-verify',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicInputComponent,
    LoadingIndicatorComponent,
  ],
  providers: [LoadingService, LoginManageService],
  templateUrl: './login-verify.component.html',
  styleUrl: './login-verify.component.scss'
})
export default class LoginVerifyComponent {
  validateForm!: FormGroup;

  constructor(
    private router: Router,
    private loginManageService: LoginManageService,
    private loadingService: LoadingService,
    private localStorageService: LocalStorageService,
    private dialogService: DialogService
  ) {
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
    this.loginManageService.loginVerify(reqData).pipe(
      filter(res => res.Status?.toString() === RestStatus.SUCCESS), // Ensure `res.Status` exists and is a string
      catchError((err) => {
        this.localStorageService.clear();
        this.dialogService.openCustomSnackbar({
          message: err.message || 'An error occurred during login.'
        });
        // Ensure we continue the observable stream so that `finalize` will still be called
        return of(new Error(err.message));
      }),
      tap(res => {
        if (res) {
          this.localStorageService.setItem('isLoggedIn', reqData.username);
          this.router.navigate(['/home']);
        }
      }),
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
