import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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

  constructor() { }

  get required(): boolean {
    return this.ctl?.validator ? this.ctl?.validator({} as AbstractControl)?.['required'] !== undefined : false;
  }

  ngOnInit(): void {
    if (!this.autocomplete) {
      this.autocomplete = this.ctlName;
    }
    this.updateControl();

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
    const filterValue = value?.toLowerCase();
    return this.options.filter(option => option.value?.toLowerCase()?.includes(filterValue));
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
  }

  ngDoCheck(): void {
    if (this.ctl?.errors) {
      this.firstErr = Object.values(this.ctl.errors)[0] as string;
    }
  }

  hasError(): boolean {
    return this.ctl && (this.ctl.dirty || this.ctl.touched) && this.ctl.errors !== null;
  }

}
