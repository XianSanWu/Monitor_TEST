import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { catchError, finalize, forkJoin, of, takeUntil, tap } from 'rxjs';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { CollapsibleSectionComponent } from '../../../component/form/collapsible-section/collapsible-section.component';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { MsmqQueueInfoRequest } from '../../../core/models/requests/msmq.model';
import { MsmqQueueDetailsResponse } from '../../../core/models/responses/msmq.model';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { BaseComponent } from '../../base.component';
import { MsmqManageService } from '../msmq-manage.service';

@Component({
  selector: 'queue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicInputComponent,
    LoadingIndicatorComponent,
    CollapsibleSectionComponent
  ],
  providers: [MsmqManageService],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.scss'
})
export default class QueueComponent extends BaseComponent implements OnInit {
  validateForm: FormGroup;
  respData1!: MsmqQueueDetailsResponse;
  isApiFinish: boolean = true;

  constructor(
    private dialogService: DialogService,
    private msmqManageService: MsmqManageService,
    private loadingService: LoadingService,
  ) {
    super();

    this.validateForm = new FormGroup({
      queueName: new FormControl('', [ValidatorsUtil.blank]),
    });
  }


  ngOnInit(): void {
    this.Search();
  }

  // 使用 HostListener 監聽 Enter 鍵
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    if (this.validateForm.invalid) {
      return;
    }

    this.Search();
  }

  Search(): void {
    if (!this.isApiFinish) {
      return;
    }
    this.isApiFinish = false;

    this.loadingService.show();
    const list1_reqData = new MsmqQueueInfoRequest({
      queueName: this.validateForm.get('queueName')?.value
    })

    forkJoin({
      list1: this.msmqManageService.GetAllQueue(list1_reqData).pipe(
        catchError(err => {
          this.dialogService.openCustomSnackbar({ message: '錯誤在API：GetAllQueue。' + err.message || '錯誤在API：GetAllQueue' });
          console.error('[list1] 錯誤在API：GetAllQueue。API error:', err);
          return of(null); // 不要 throw，讓流程繼續
        })
      ),
    })
      .pipe(
        takeUntil(this.destroy$),
        tap(result => {
          // 同時取得多個 API 的回傳結果
          if (result.list1) {
            this.respData1 = result.list1.Data;
            // console.log('list1 成功', this.respData1);
          }
        }),
        finalize(() => {
          this.isApiFinish = true;
          this.loadingService.hide();
        })
      )
      .subscribe();

  }


}
