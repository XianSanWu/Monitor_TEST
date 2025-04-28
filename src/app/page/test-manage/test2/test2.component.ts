import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { FileInputComponent } from '../../../component/form/file-input/file-input.component';
import { TestManageService } from '../test-manage.service';
import { DialogService } from '../../../core/services/dialog.service';
import { catchError, finalize, takeUntil, tap } from 'rxjs';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'test2',
  standalone: true,
  imports: [
    FileInputComponent,
    LoadingIndicatorComponent
  ],
  providers: [LoadingService, TestManageService],
  templateUrl: './test2.component.html',
  styleUrl: './test2.component.scss'
})
export default class Test2Component extends BaseComponent{

  form: FormGroup;

  constructor(
    private dialogService: DialogService,
    private loadingService: LoadingService,
    private testManageService: TestManageService
  ) {
    super();
    // this.onFileSelected = this.onFileSelected.bind(this)
    // 初始化表單
    this.form = new FormGroup({
      fileName: new FormControl('', [Validators.required, ValidatorsUtil.blank]),
    });
  }

  ngOnInit(): void {
    console.log('TEST_PAGE_22222')
  }

  //#region 檔案上傳
  selectedFile: File | null = null;
  onFileSelected = (event: any): void => {
    this.selectedFile = event.target.files[0];
    // console.log('this.selectedFile',this.selectedFile)
    this.onUpload();
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.loadingService.show();
      this.testManageService.uploadFile(this.selectedFile).pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message || 'An error.'
          });
          throw Error(err.message);
        }),
        tap(event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const progress = Math.round((100 * event.loaded) / event.total);
            console.log(`上傳進度: ${progress}%`);
          } else if (event instanceof HttpResponse) {
            console.log('檔案上傳成功', event);
          }
        }),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      ).subscribe();
    }
  }
  //#endregion


  //#region 檔案下載
  // onDownload(fileName: string): void {
  //   this.loadingService.show();
  //   this.testManageService.downloadFile(fileName).pipe(
  //     tap(blob => {
  //       if (blob instanceof Blob) {
  //         const objectUrl = URL.createObjectURL(blob);
  //         const a = document.createElement('a');
  //         a.href = objectUrl;
  //         a.download = fileName;
  //         document.body.appendChild(a);
  //         a.click();
  //         document.body.removeChild(a);
  //         URL.revokeObjectURL(objectUrl);

  //         this.dialogService.openCustomSnackbar({
  //           message: '下載成功'
  //         });
  //       } else {
  //         throw new Error('下載失敗，未能取得 Blob');
  //       }
  //     }),
  //     catchError((err) => {
  //       this.dialogService.openCustomSnackbar({
  //         message: err.message || '下載錯誤'
  //       });
  //       return throwError(() => new Error(err.message));
  //     }),
  //     finalize(() => {
  //       this.loadingService.hide();
  //     })
  //   ).subscribe();
  // }
  //#endregion

}

