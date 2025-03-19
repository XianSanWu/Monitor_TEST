import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { LoginManageService } from '../login-manage.service';
import { catchError, filter, finalize, tap } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { LoginRequest } from '../../../core/models/requests/login.model';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { LoadingIndicatorComponent } from '../../../shared/loading-indicator/loading-indicator.component';
import { DialogService } from '../../../core/services/dialog.service';
import { RestStatus } from '../../../common/enums/rest-enum';
// import { RestStatus } from '../../../common/enums/rest-enum';

@Component({
  selector: 'login-verify',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BasicInputComponent,
    LoadingIndicatorComponent,
  ],
  providers: [LoadingService, LoginManageService],
  templateUrl: './login-verify.component.html',
  styleUrl: './login-verify.component.scss'
})
export class LoginVerifyComponent {
  validateForm: FormGroup;

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
    let reqData: LoginRequest = this.validateForm.getRawValue();
    this.loadingService.show();
    this.loginManageService.loginVerify(reqData).pipe(
      catchError((err) => {
        this.localStorageService.clear();
        this.dialogService.openCustomSnackbar({
          message: err.message
        });
        throw new Error(err.message);
      }),
      filter(res => res.Status?.toString() === RestStatus.SUCCESS),
      tap(res => {
        this.localStorageService.setItem('isLoggedIn', 'true');
        this.router.navigate(['/home']);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    ).subscribe()

  }

  // 監聽 Enter 鍵
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    this.submit();
  }

}

