import {
  IFilterComp,
  IFilterParams,
  IDoesFilterPassParams,
  IAfterGuiAttachedParams
} from 'ag-grid-community';

interface SelectFilterParams extends IFilterParams {
  options: string[];
}

export class SelectFilterComponent implements IFilterComp {
  private params!: SelectFilterParams;
  private gui!: HTMLDivElement;
  private selectElement!: HTMLSelectElement;
  private selectedValue: string | null = null;

  // 初始化 filter，接收欄位與 options
  init(params: IFilterParams): void {
    this.params = params as SelectFilterParams;

    const options = this.params.options ?? [];
    this.createGui(options);
  }

  // 建立下拉選單 GUI
  private createGui(options: string[]): void {
    this.gui = document.createElement('div');
    this.gui.innerHTML = `
    <div class="custom-filter-wrapper">
    <div class="filter-header">請選擇搜尋條件</div>
      <div class="filter-body">
        <select class="filter-select" id="filterSelect">
          <option value="">-- 全部 --</option>
          ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
        </select>
      </div>
    </div>
    `;

    this.selectElement = this.gui.querySelector('#filterSelect') as HTMLSelectElement;

    this.selectElement.addEventListener('change', () => {
      this.selectedValue = this.selectElement.value;
      this.params.filterChangedCallback();
    });
  }

  // 傳回 filter 的 DOM 元件
  getGui(): HTMLElement {
    return this.gui;
  }

  // 是否啟用 filter（用於是否要作用）
  isFilterActive(): boolean {
    return !!this.selectedValue;
  }

  // 資料列是否通過 filter
  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const field = this.params.colDef.field!;
    const rowValue = params.node.data?.[field];
    return !this.selectedValue || rowValue === this.selectedValue;
  }

  // 傳回目前 filter 狀態（用於儲存/還原）
  getModel(): any {
    return this.isFilterActive() ? { value: this.selectedValue } : null;
  }

  // 載入儲存的 filter 狀態
  setModel(model: any): void {
    this.selectedValue = model?.value ?? null;
    if (this.selectElement) {
      this.selectElement.value = this.selectedValue || '';
    }
  }

  // GUI 渲染後自動 focus
  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    if (!params?.suppressFocus) {
      this.selectElement?.focus();
    }
  }
}
