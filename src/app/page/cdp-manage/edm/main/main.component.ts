
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { CellDoubleClickedEvent, ColDef, GridApi, ICellRendererParams } from 'ag-grid-community';
import { catchError, finalize, forkJoin, of, takeUntil, tap } from 'rxjs';
import { CommonUtil } from '../../../../common/utils/common-util';
import { CustomFilterComponent } from '../../../../component/ag-grid/custom-filter/custom-filter.component';
import { SelectFilterComponent } from '../../../../component/ag-grid/select-filter/select-filter.component';
import { AttoProgressComponent } from '../../../../component/form/atto-progress/atto-progress.component';
import { BasicInputComponent } from '../../../../component/form/basic-input/basic-input.component';
import { CollapsibleSectionComponent } from '../../../../component/form/collapsible-section/collapsible-section.component';
import { LoadingIndicatorComponent } from '../../../../component/loading/loading-indicator/loading-indicator.component';
import { Channel } from '../../../../core/enums/channel-enum';
import { Option, PageBase } from '../../../../core/models/common/base.model';
import { WorkflowStepsKafkaRequest, WorkflowStepsSearchListRequest } from '../../../../core/models/requests/workflow-steps.model';
import { WorkflowStepsKafkaResponse } from '../../../../core/models/responses/workflow-steps.model';
import { ConfigService } from '../../../../core/services/config.service';
import { DialogService } from '../../../../core/services/dialog.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { BaseComponent } from '../../../base.component';
import { CdpManageService } from '../../cdp-manage.service';

@Component({
  selector: 'edm-main',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicInputComponent,
    AgGridModule,
    AttoProgressComponent,
    LoadingIndicatorComponent,
    CollapsibleSectionComponent
  ],
  providers: [CdpManageService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export default class MainComponent extends BaseComponent implements OnInit {
  constructor(
    // private dialog: MatDialog,
    private dialogService: DialogService,
    private cdpManageService: CdpManageService,
    private configService: ConfigService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    super();
    // 初始化表單
    this.validateForm = new FormGroup({
      channel: new FormControl(Channel.EDM, []),
    });

    this.configService.configData$.subscribe(data => {
      this.edmAttoProgress = data?.EDM_ATTO_PROGRESS;
    });
  }

  edmAttoProgress = new Array<string>();
  validateForm: FormGroup;
  respData1?: WorkflowStepsKafkaResponse;

  ngOnInit(): void {
    this.loadingService.show();
    const list1_reqData = new WorkflowStepsKafkaRequest({
      channel: this.validateForm.get('channel')?.value
    })
    // const list2_reqData = new WorkflowStepsKafkaRequest({
    //   channel: ''
    // })

    forkJoin({
      list1: this.cdpManageService.GetKafkaLag(list1_reqData).pipe(
        catchError(err => {
          this.dialogService.openCustomSnackbar({ message: '錯誤在API：GetKafkaLag。' + err.message || '錯誤在API：GetKafkaLag' });
          console.error('[list1] 錯誤在API：GetKafkaLag。API error:', err);
          return of(null); // 不要 throw，讓流程繼續
        })
      ),
      // list2: this.cdpManageService.GetKafkaLag(list2_reqData).pipe(
      //   catchError(err => {
      //     this.dialogService.openCustomSnackbar({ message: 'Error on List2' });
      //     console.error('[list2] API error:', err);
      //     return of(null); // 不要 throw，讓流程繼續
      //   })
      // ),
      // list3: this.cdpManageService.GetKafkaLag(list2_reqData).pipe(
      //   catchError(err => {
      //     this.dialogService.openCustomSnackbar({ message: 'Error on list3' });
      //     console.error('[list3] API error:', err);
      //     return of(null); // 不要 throw，讓流程繼續
      //   })
      // ),
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
          this.loadingService.hide();
        })
      )
      .subscribe();

  }

  get committedTotal(): number {
    return this.respData1?.PartitionLags?.reduce(
      (sum, x) => sum + (x?.CommittedOffset ?? 0),
      0
    ) ?? 0;
  }

  get highWatermarkTotal(): number {
    return this.respData1?.PartitionLags?.reduce(
      (sum, x) => sum + (x?.HighWatermark ?? 0),
      0
    ) ?? 0;
  }

  //#region Ag-grid
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  gridApi!: GridApi;
  rowData: any[] = [];

  defaultColDef = {
    sortable: true,
    filter: CustomFilterComponent,
  };

  columnDefs: ColDef[] = [
    {
      headerName: "序號",
      valueGetter: params => {
        const rowIndex = params.node?.rowIndex ?? -1;
        const currentPage = params.api.paginationGetCurrentPage();
        const pageSize = params.api.paginationGetPageSize();
        return rowIndex >= 0 ? rowIndex + 1 + (currentPage * pageSize) : '';
      },
      width: 100
    },
    {
      headerName: '批號', field: 'SendUuidSort',
      maxWidth: 90,
      cellClass: 'centered-cell',
      headerClass: 'centered-header',
      filter: false // 關掉這一欄的 filter
    },
    {
      headerName: '愛酷 BatchId', field: 'BatchId',
      cellRenderer: (params: ICellRendererParams) => {
        const batchId = params.value;
        const sendUuidSort = params.data.SendUuidSort;
        const linkText = batchId;

        // 建立一個元素
        const a = document.createElement('a');
        a.href = 'javascript:void(0)';
        a.innerText = linkText;
        a.style.cursor = 'pointer';

        // 點擊時用 Angular router 導航，避免整頁刷新
        a.addEventListener('click', (e) => {
          e.preventDefault();
          this.router.navigate(['/cdp/edm_detail', batchId, sendUuidSort]);
        });

        return a;
      },
      maxWidth: 160
    },
    // { headerName: '地端 CdpUuid', field: 'CdpUuid' },
    {
      headerName: '旅程/群發', field: 'ChannelType',
      filter: SelectFilterComponent,
      maxWidth: 140,
      filterParams: {
        options: ['Journey', 'GroupSend'],
        optionLabels: ['旅程', '群發']
      },
      cellRenderer: (params: ICellRendererParams) => {
        const value = (params.value || '').toLocaleLowerCase();
        if (value === 'journey') {
          return CommonUtil.getColoredLabel(value, '#8e44ad', '旅程'); // 紫色
        } else if (value === 'groupsend') {
          return CommonUtil.getColoredLabel(value, '#e67e22', '群發'); // 橘色
        }
        return params.value;
      }
    },
    { headerName: '旅程/群發名稱', field: 'ActivityName' },
    { headerName: '節點名稱', field: 'NodeName' },
    {
      headerName: '旅程/群發狀態', field: 'ActivityStatus',
      filter: SelectFilterComponent,
      filterParams: {
        options: ['Completed', 'Progress'],
        optionLabels: ['已完成', '進行中']
      },
      cellRenderer: (params: ICellRendererParams) => {
        const value = (params.value || '').toLocaleLowerCase();
        if (value === 'completed') {
          return CommonUtil.getColoredLabel(value, '#28a745', '已完成'); // 綠
        } else if (value === 'progress') {
          return CommonUtil.getColoredLabel(value, '#ffc107', '進行中'); // 黃
        }
        return params.value;
      }
    },
    {
      headerName: '進度狀態', field: 'ProgressStatus',
      filter: SelectFilterComponent,
      filterParams: {
        options: ['CDP', 'FTP', 'MailHunter', 'Completed'],
        optionLabels: ['CDP', 'FTP', 'MailHunter', '完成']
      },
      cellRenderer: (params: ICellRendererParams): string => {
        const raw = params.value || '';
        const value = raw.toString().toLocaleLowerCase();

        const wrapperStart = `<div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">`;
        const wrapperEnd = `</div>`;

        if (value === 'completed') {
          const label = CommonUtil.getColoredLabel(value, '#28a745', '完成'); // 綠色
          return `${wrapperStart}${label}${wrapperEnd}`;
        } else {
          const processing = CommonUtil.getColoredLabel(value, '#17a2b8', '處理中'); // 青色
          return `${wrapperStart}<span>${raw}</span>${processing}${wrapperEnd}`;
        }
      }
    },
    {
      headerName: '建立時間', field: 'CreateAt',
      maxWidth: 170,
      cellRenderer: (params: ICellRendererParams) => {
        const rawValue = params.value || '';
        if (rawValue === '0001-01-01 00:00:00') {
          return '';
        }

        return rawValue;
      }
    },
    {
      headerName: '更新時間', field: 'UpdateAt',
      maxWidth: 170,
      cellRenderer: (params: ICellRendererParams) => {
        const rawValue = params.value || '';
        if (rawValue === '0001-01-01 00:00:00') {
          return '';
        }

        return rawValue;
      }
    },
    // { headerName: '旅程建立時間', field: 'JourneyCreateAt' },
    // { headerName: '旅程更新時間', field: 'JourneyUpdateAt' },
    // { headerName: '旅程完成時間', field: 'JourneyFinishAt' },
    // { headerName: '群發建立時間', field: 'GroupSendCreateAt' },
    // { headerName: '群發更新時間', field: 'GroupSendUpdateAt' },
  ];

  //強制Ag-grid資料複製 (因複製功能為企業版才可以用)
  onCellDoubleClicked(event: CellDoubleClickedEvent) {
    const value = event.value;
    if (value !== null && value !== undefined) {
      navigator.clipboard.writeText(value?.toString()?.trim())
        .then(() => {
          this.dialogService.openCustomSnackbar({ title: '提示訊息', message: '複製成功：' + value || '複製失敗' });
        })
        .catch(err => {
          this.dialogService.openCustomSnackbar({ title: '提示訊息', message: '複製失敗：' + err.message || '複製失敗' });
        });
    }
  }

  // 分頁相關
  pageSize = 10; // 每頁顯示筆數
  currentPage = 1; // 當前頁數
  totalPages = 1; // 總頁數
  totalCount = 0; // 總筆數
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.loadData();
  }

  //  **呼叫後端 API 載入資料**
  loadData() {
    this.loadingService.show();

    //#region 組裝請求資料
    // 取得 ag-Grid 的排序資訊
    const columnModel = this.gridApi?.getColumnState() || [];
    // console.log('columnModel', columnModel)
    const gridSortModel = columnModel?.filter(f => f.sort)?.[0];
    let sortModel: Option | null = null;
    const sortField = gridSortModel?.colId ?? '';
    const sortOrder = gridSortModel?.sort ?? '';
    sortModel = new Option({
      key: sortField,
      value: sortOrder,
    })

    // 取得 ag-Grid 的篩選條件
    const gridFilterModel = this.gridApi?.getFilterModel() || {};
    let filterModel: Array<Option> = new Array<Option>();

    // 檢查 gridFilterModel 是否為非空物件
    if (Object.keys(gridFilterModel).length > 0) {
      // 使用 Object.entries() 來遍歷物件的鍵值對
      Object.entries(gridFilterModel).forEach(([key, f]) => {
        filterModel.push(
          new Option({
            key: key,
            value: f.value,
          })
        );
      });
    }

    // console.log('gridFilterModel', gridFilterModel)
    // console.log('filterModel', filterModel)
    const pageBase = new PageBase(
      {
        pageSize: this.pageSize,
        pageIndex: this.currentPage,
        totalCount: this.totalCount
      }
    )

    // 組裝請求資料
    const reqData: WorkflowStepsSearchListRequest = {
      page: pageBase,
      sortModel: sortModel,
      filterModel: filterModel,
      fieldModel: this.validateForm.getRawValue(),
    };
    //#endregion

    this.cdpManageService.getSearchListList(reqData)
      .pipe(
        catchError((err) => {
          this.dialogService.openCustomSnackbar({
            message: err.message || '查詢列表失敗'
          });
          throw Error(err.message);
        }),
        tap(res => {
          this.rowData = res.Data.SearchItem;
          this.totalCount = res.Data.Page.TotalCount;
          this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        }),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      ).subscribe();
  }

  //  **處理分頁按鈕點擊**
  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return; // 避免超過範圍
    this.currentPage = page;
    this.loadData();
  }

  //  **處理排序改變**
  onSortChanged() {
    this.currentPage = 1; // 重新排序時回到第一頁
    this.loadData();
  }

  //  **處理篩選改變**
  onFilterChanged() {
    this.currentPage = 1; // 重新篩選時回到第一頁
    this.loadData();
  }
  //#endregion

}
