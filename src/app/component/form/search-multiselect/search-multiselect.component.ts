import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  Output,
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
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Observable, map, startWith } from 'rxjs';
import { Option } from '../../../core/models/common/base.model';

/** 🔴 自訂錯誤顯示控制器，讓 mat-form-field 能顯示紅框 */
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
  errorMatcher!: ErrorStateMatcher; // 🔴 加入錯誤匹配器

  constructor(private differs: IterableDiffers) {}

  get required(): boolean {
    return this.ctl?.validator
      ? this.ctl?.validator({} as AbstractControl)?.['required'] !== undefined
      : false;
  }

  ngOnInit(): void {
    if (!this.form || !this.ctlName)
      throw new Error('form 與 ctlName 為必填屬性');

    this.ctl = this.form.get(this.ctlName) as FormControl;
    if (!this.ctl.value) this.ctl.setValue([]);
    if (this.required) this.ctl.addValidators(Validators.required);

    this.optionsDiffer = this.differs.find([]).create<Option>();
    this.selectedOptions = this.getSelectedOptions();

    // 🔴 初始化錯誤匹配器
    this.errorMatcher = new MultiSelectErrorStateMatcher(this.ctl);

    this.filteredOptions$ = this.inputCtrl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  ngDoCheck(): void {
    if (this.optionsDiffer && this.options) {
      const diff = this.optionsDiffer.diff(this.options);
      if (diff) this.refresh();
    }
    if (this.ctl?.errors)
      this.firstErr = Object.values(this.ctl.errors)[0] as string;
  }

  private getSelectedOptions(): Option[] {
    const keys = this.ctl?.value ?? [];
    return (this.options ?? []).filter((o) => keys.includes(o.key));
  }

  private _filter(value: string): Option[] {
    const filterValue = value.toLowerCase();
    const currentKeys = this.ctl.value ?? [];
    return this.options.filter(
      (option) =>
        option.value?.toLowerCase().includes(filterValue) &&
        !currentKeys.includes(option.key)
    );
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const key = event.option.value;
    const current = this.ctl.value ?? [];
    if (!current.includes(key)) {
      const newVal = [...current, key];
      this.ctl.setValue(newVal);
      this.selectedOptions = this.getSelectedOptions();
      this.selectedChange.emit(newVal);
    }
    this.inputCtrl.setValue('');
  }

  remove(option: Option): void {
    const current = this.ctl.value ?? [];
    const index = current.indexOf(option.key);
    if (index >= 0) {
      current.splice(index, 1);
      this.ctl.setValue([...current]);
      this.selectedOptions = this.getSelectedOptions();
      this.selectedChange.emit([...current]);
      this.ctl.markAsDirty();
      this.ctl.markAsTouched();
    }
    this.inputCtrl.setValue(this.inputCtrl.value ?? '');
  }

  private refresh() {
    this.selectedOptions = this.getSelectedOptions();
    const v = this.ctl?.value ?? [];
    this.ctl?.setValue(v, { emitEvent: true });
  }

  hasError(): boolean {
    return (
      this.ctl &&
      (this.ctl.dirty || this.ctl.touched) &&
      this.ctl.errors != null
    );
  }
}
