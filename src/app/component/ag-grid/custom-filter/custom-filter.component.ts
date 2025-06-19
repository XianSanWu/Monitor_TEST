import type { IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterComp, IFilterParams } from 'ag-grid-community';

export class CustomFilterComponent implements IFilterComp {
  filterParams!: IFilterParams;
  filterText!: string | null;
  gui!: HTMLDivElement;
  eFilterText: any;
  debounceTimeout: any;

  init(params: IFilterParams) {
    this.filterParams = params;
    this.filterText = null;
    this.setupGui(params);
  }

  setupGui(params: IFilterParams) {
    this.gui = document.createElement('div');
    this.gui.innerHTML = `
          <div class="custom-filter-wrapper">
            <div class="filter-header">請輸入搜尋條件</div>
            <div class="filter-body">
              <input
                type="text"
                id="filterText"
                class="filter-input"
                placeholder="輸入過濾條件..."
              />
            </div>
          </div>
        `;

    const listener = (event: any) => {
      this.filterText = event.target.value;

      // 先清掉舊的 timer
      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      // 設定 debounce: 例如 500ms
      this.debounceTimeout = setTimeout(() => {
        params.filterChangedCallback();
      }, 500);
    };

    this.eFilterText = this.gui.querySelector('#filterText');
    this.eFilterText.addEventListener('input', listener);
  }

  getGui() {
    return this.gui;
  }

  doesFilterPass(params: IDoesFilterPassParams) {
    const { node } = params;
    let passed = true;
    this.filterText
      ?.toLowerCase()
      .split(' ')
      .forEach((filterWord) => {
        const value = this.filterParams.getValue(node);
        if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
          passed = false;
        }
      });
    return passed;
  }

  isFilterActive() {
    return this.filterText != null && this.filterText !== '';
  }

  getModel() {
    if (!this.isFilterActive()) {
      return null;
    }
    return { value: this.filterText };
  }

  setModel(model: any) {
    const newValue = model == null ? null : model.value;
    this.eFilterText.value = newValue;
    this.filterText = newValue;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    if (!params?.suppressFocus) {
      this.eFilterText.focus();
    }
  }
}

