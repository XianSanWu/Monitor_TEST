import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, IterableDiffer, IterableDiffers, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { map, Observable, startWith } from 'rxjs';
import { Option } from '../../../core/models/common/base.model';

@Component({
  selector: 'search-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule],
  templateUrl: './search-select.component.html',
  styleUrl: './search-select.component.scss'
})
export class SearchSelectComponent implements OnInit {
  @Input() title: string = '';
  @Input() form!: FormGroup;
  @Input() ctlName: string = '';
  @Input() placeholder: string = '請輸入';
  @Input() maxlength: number = 10;
  @Input() disabled: boolean = false;
  @Input() autocomplete: string = '';

  @Input() options: Option[] = [];
  @Output() selected = new EventEmitter<string>();

  filteredOptions!: Observable<Option[]>;

  firstErr: string = '';
  ctl!: FormControl;

  // 新增：用來偵測 options 陣列內容的變化（即便是 push）
  private optionsDiffer!: IterableDiffer<Option>;

  constructor(private differs: IterableDiffers) { }

  get required(): boolean {
    return this.ctl?.validator ? this.ctl?.validator({} as AbstractControl)?.['required'] !== undefined : false;
  }

  ngOnInit(): void {
    if (!this.autocomplete) {
      this.autocomplete = this.ctlName;
    }
    this.updateControl();

    // 初始化 differ（用空陣列定義型別即可）
    this.optionsDiffer = this.differs.find([]).create<Option>();

    this.filteredOptions = this.ctl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

  private updateControl(): void {
    if (this.form && this.ctlName) {
      this.ctl = this.form.get(this.ctlName) as FormControl;
    }
  }

  private _filter(value: string): Option[] {
    const filterValue = (value ?? '').toLowerCase();
    return (this.options ?? []).filter(option => option.value?.toLowerCase()?.includes(filterValue));
  }

  // 偵測父層對 options 的 push / splice 等動作，一有變化就強制觸發一次過濾
  ngDoCheck(): void {
    if (this.optionsDiffer && this.options) {
      const diff = this.optionsDiffer.diff(this.options);
      if (diff) {
        // 重新觸發 valueChanges，讓面板立刻更新（不需使用者輸入）
        const v = this.ctl?.value ?? '';
        this.ctl?.setValue(v); // emitEvent 預設 true -> 會觸發 filteredOptions pipeline
      }
    }

    if (this.ctl?.errors) {
      this.firstErr = Object.values(this.ctl.errors)[0] as string;
    }
  }

  selectOption(key: string) {
    const option = this.options.find(option => option.key?.toLowerCase() === key?.toLowerCase());
    if (option) {
      this.ctl.setValue(option.value, { emitEvent: false });
      this.selected.emit(key);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ctlName'] || changes['form']) {
      this.updateControl();
    }
    // （可選）若父層是用重新指派新陣列的方式，這裡也一併處理
    if (changes['options'] && !changes['options'].firstChange) {
      const v = this.ctl?.value ?? '';
      this.ctl?.setValue(v);
    }
  }

  hasError(): boolean {
    return this.ctl && (this.ctl.dirty || this.ctl.touched) && this.ctl.errors !== null;
  }
}
