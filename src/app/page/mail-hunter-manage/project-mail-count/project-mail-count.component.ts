import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';
import { LoadingService } from '../../../core/services/loading.service';
import { MailHunterManageService } from '../mail-hunter-manage.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { BasicInputComponent } from '../../../component/form/basic-input/basic-input.component';
import { CollapsibleSectionComponent } from '../../../component/form/collapsible-section/collapsible-section.component';
import { BaseComponent } from '../../base.component';
import { DialogService } from '../../../core/services/dialog.service';
import { SearchSelectComponent } from '../../../component/form/search-select/search-select.component';
import { DateRangeComponent } from '../../../component/form/date-range/date-range.component';
import { ValidatorsUtil } from '../../../common/utils/validators-util';
import { GridApi, ColDef, ICellRendererParams, CellDoubleClickedEvent } from 'ag-grid-community';
import { CommonUtil } from '../../../common/utils/common-util';
import { CustomFilterComponent } from '../../../component/ag-grid/custom-filter/custom-filter.component';
import { SelectFilterComponent } from '../../../component/ag-grid/select-filter/select-filter.component';

@Component({
  selector: 'project-mail-count',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BasicInputComponent,
    DateRangeComponent,
    SearchSelectComponent,
    LoadingIndicatorComponent,
    AgGridModule,
    CollapsibleSectionComponent
  ],
  providers: [LoadingService, MailHunterManageService],
  templateUrl: './project-mail-count.component.html',
  styleUrl: './project-mail-count.component.scss'
})
export default class ProjectMailCountComponent extends BaseComponent {
  validateForm: FormGroup;
  selectedItem = '';
  departmentList = [];
  constructor(
    private dialogService: DialogService,
    private mailHunterManageService: MailHunterManageService,
    private loadingService: LoadingService,
  ) {
    super();

    this.validateForm = new FormGroup({
      department: new FormControl('', [Validators.required, ValidatorsUtil.blank, ValidatorsUtil.intSymbolsEnglishNumbers]),
      startDate: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt]),
      endDate: new FormControl('', [Validators.required, ValidatorsUtil.dateFmt]),
    }, { validators: ValidatorsUtil.dateRangeValidator });
  }


  // 使用 HostListener 監聽 Enter 鍵
  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    this.loadData();
  }

  onItemSelected(value: string) {
    this.selectedItem = value;
    console.log('選中的值:', value);
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
    // {
    //   headerName: '愛酷 SendUuid', field: 'SendUuid',
    // },

  ];

  //強制Ag-grid資料複製 (因複製功能為企業板才可以用)
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
