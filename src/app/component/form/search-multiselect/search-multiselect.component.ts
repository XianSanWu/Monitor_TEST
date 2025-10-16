import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';
import { Option } from '../../../core/models/common/base.model';

/** 自訂錯誤顯示控制器 */
class MultiSelectErrorStateMatcher implements ErrorStateMatcher {
  constructor(private ctl: FormControl) {}
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      this.ctl &&
      this.ctl.invalid &&
      (this.ctl.dirty || this.ctl.touched)
    );
  }
}

@Component({
  selector: 'search-multiselect',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatFormField,
  ],
  templateUrl: './search-multiselect.component.html',
  styleUrls: ['./search-multiselect.component.scss'],
})
export class SearchMultiselectComponent implements OnInit {
  @Input() title: string = '';
  @Input() form!: FormGroup;
  @Input() ctlName: string = '';
  @Input() placeholder: string = '請輸入以搜尋';
  @Input() disabled: boolean = false;
  @Input() options: Option[] = [];

  @Output() selectedChange = new EventEmitter<string[]>();

  ctl!: FormControl;
  inputCtrl = new FormControl('');
  filteredOptions$!: Observable<Option[]>;
  selectedOptions: Option[] = [];
  firstErr: string = '';

  private optionsDiffer!: IterableDiffer<Option>;
  errorMatcher!: ErrorStateMatcher;

  @ViewChild(MatAutocompleteTrigger)
  autocompleteTrigger!: MatAutocompleteTrigger;

  constructor(private differs: IterableDiffers) {}

  get required(): boolean {
    return this.ctl?.validator
      ? this.ctl?.validator({} as AbstractControl)?.['required'] !== undefined
      : false;
  }

  /** 永遠不顯示選中值，避免 autocomplete 打勾勾 */
  displayFn = () => '';

  ngOnInit(): void {
    if (!this.form || !this.ctlName)
      throw new Error('form 與 ctlName 為必填屬性');

    this.ctl = this.form.get(this.ctlName) as FormControl;
    if (!this.ctl.value) this.ctl.setValue([]);
    if (this.required) this.ctl.addValidators(Validators.required);

    this.optionsDiffer = this.differs.find([]).create<Option>();
    this.selectedOptions = this.getSelectedOptions();
    this.errorMatcher = new MultiSelectErrorStateMatcher(this.ctl);

    // 收尋 Observable
    this.filteredOptions$ = this.inputCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.refresh();
    }
  }

  ngDoCheck(): void {
    if (this.optionsDiffer && this.options) {
      const diff = this.optionsDiffer.diff(this.options);
      if (diff) this.refresh();
    }
    if (this.ctl?.errors)
      this.firstErr = Object.values(this.ctl.errors)[0] as string;
  }

  /** 點擊輸入框 → 打開下拉 */
  onInputClick(): void {
    if (this.disabled) return;

    // 清空輸入框，觸發重新篩選
    this.inputCtrl.setValue('');

    // 強制打開下拉
    setTimeout(() => {
      if (this.autocompleteTrigger && !this.autocompleteTrigger.panelOpen) {
        this.autocompleteTrigger.openPanel();
      }
    });
  }

  /** 選取選項 */
  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const key = event.option.value;
    const current: string[] = this.ctl.value ?? [];
    if (!current.includes(key)) {
      const newVal = [...current, key];
      this.ctl.setValue(newVal);
      this.selectedOptions = this.getSelectedOptions();
      this.selectedChange.emit(newVal);
    }
    this.inputCtrl.setValue(''); // 清空輸入框
  }

  /** 移除已選項目 */
  remove(option: Option): void {
    const current: string[] = this.ctl.value ?? [];
    const newVal: string[] = current.filter((k: string) => k !== option.key);

    this.ctl.setValue(newVal);
    this.selectedOptions = this.getSelectedOptions();
    this.selectedChange.emit(newVal);
    this.ctl.markAsDirty();
    this.ctl.markAsTouched();

    // 重新觸發收尋 observable
    this.inputCtrl.setValue(this.inputCtrl.value ?? '');
  }

  private getSelectedOptions(): Option[] {
    const keys: string[] = (this.ctl?.value ?? []) as string[];
    return Array.isArray(this.options)
      ? this.options.filter((o) => o.key && keys.includes(o.key))
      : [];
  }

  private _filter(value: string): Option[] {
    const filterValue = value.toLowerCase();
    const currentKeys = this.ctl.value ?? [];

    if (!value) {
      // 空字串 → 顯示所有未選取項目
      return this.options.filter((o) => !currentKeys.includes(o.key));
    }

    return this.options.filter(
      (o) =>
        o.value?.toLowerCase().includes(filterValue) &&
        !currentKeys.includes(o.key)
    );
  }

  private refresh() {
    this.selectedOptions = this.getSelectedOptions();
    const v = this.ctl?.value ?? [];
    this.ctl?.setValue(v, { emitEvent: true });
  }

  hasError(): boolean {
    return !!(
      this.ctl &&
      (this.ctl.dirty || this.ctl.touched) &&
      this.ctl.errors != null
    );
  }
}
