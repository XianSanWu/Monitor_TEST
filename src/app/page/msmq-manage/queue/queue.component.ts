import { Component, HostListener, OnInit } from '@angular/core';
import { BaseComponent } from '../../base.component';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { CommonModule } from '@angular/common';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { CollapsibleSectionComponent } from '../../../component/form/collapsible-section/collapsible-section.component';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { forkJoin, catchError, of, takeUntil, finalize, tap } from 'rxjs';
import { MsmqManageService } from '../msmq-manage.service';
import { MsmqQueueInfoRequest } from '../../../core/models/requests/msmq.model';
import { MsmqQueueDetailsResponse } from '../../../core/models/responses/msmq.model';

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
  providers: [LoadingService, MsmqManageService],
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
      queueName: new FormControl('', []),
    });
  }


  ngOnInit(): void {
    this.Search();
  }

  // 使用 HostListener 監聽 Enter 鍵
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
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
          this.isApiFinish = false;
          this.loadingService.hide();
        })
      )
      .subscribe();

  }


}
