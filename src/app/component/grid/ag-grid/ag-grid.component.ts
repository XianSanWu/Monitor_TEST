import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams } from 'ag-grid-community';
import { ApiService } from '../../../api/services/api.service';
import { catchError, finalize, tap } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'ag-grid',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './ag-grid.component.html',
  styleUrl: './ag-grid.component.scss'
})

export class AgGridComponent {
  @Input() columnDefs: ColDef[] = [];
  @Input() apiUrl!: string; // API 路徑
  @Input() paginationPageSize: number = 10;
  @Output() gridReady = new EventEmitter<GridReadyEvent>();

  private gridApi: any;
  public gridOptions: GridOptions = {
    paginationPageSize: this.paginationPageSize
  };

  constructor(
    private service: ApiService,
    private loadingService: LoadingService,
    private dialogService: DialogService
  ) { }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridReady.emit(params); // 傳送 GridReady 事件

    // 設定 Server-side 資料來源
    const dataSource: IServerSideDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        const request = params.request;

        // 檢查 startRow 和 endRow 是否存在，並給定預設值
        const startRow = request.startRow !== undefined ? request.startRow : 0;
        const endRow = request.endRow !== undefined ? request.endRow : 0;

        // 如果 startRow 和 endRow 是正確的範圍，處理資料
        const page = startRow / this.paginationPageSize;

        console.log(`🔹 載入第 ${page + 1} 頁，每頁 ${this.paginationPageSize} 筆資料`);

        // 使用 HttpParams 來構建查詢參數
        const httpParams = new HttpParams()
          .set('page', page.toString())  // 設定頁碼參數
          .set('size', this.paginationPageSize.toString());  // 設定每頁顯示的筆數
        this.service.doSend('get', this.apiUrl, null, httpParams)
          .pipe(
            catchError((err) => {
              this.dialogService.openCustomSnackbar({
                message: err.message
              });
              throw new Error(err.message);
            }),
            // filter(res => res.code === RestStatus.SUCCESS),
            tap(res => {
              console.log('res', res)
            }),
            finalize(() => {
              this.loadingService.hide();
            })
          )

      }
    };

    // 使用 GridOptions 來設定 Server-side 資料來源
    this.gridApi.setServerSideDatasource(dataSource); // 使用 this.gridApi 來設置
  }
}
