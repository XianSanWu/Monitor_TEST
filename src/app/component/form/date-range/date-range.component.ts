import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges, AfterViewInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'date-range',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent implements OnInit, AfterViewInit {
  @Input() form!: FormGroup;
  @Input() title: string = '日期區間範例';
  @Input() titleStart: string = '起始日期';
  @Input() titleEnd: string = '結束日期';

  @Input() disabled: boolean = false;

  ctlStartDate: AbstractControl | null = null;
  ctlEndDate: AbstractControl | null = null;

  constructor() { }

  ngOnInit() {
    if (!this.form) {
      throw new Error("FormGroup is required for DateRangeComponent");
    }
  }

  ngAfterViewInit() {
    this.setupControls();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['form']?.currentValue) {
      this.setupControls();
      // console.info('this.ctlStartDate', this.ctlStartDate)
    }
  }

  private setupControls() {
    this.ctlStartDate = this.form.get('startDate') as FormControl;
    this.ctlEndDate = this.form.get('endDate') as FormControl;
  }

  get required(): boolean {
    const ctlStartDateRequired = this.ctlStartDate?.validator ? this.ctlStartDate?.validator({} as AbstractControl)?.['required'] !== undefined : false;
    const ctlEndDateRequired = this.ctlEndDate?.validator ? this.ctlEndDate?.validator({} as AbstractControl)?.['required'] !== undefined : false;
    return ctlStartDateRequired || ctlEndDateRequired;
  }

  hasError(): boolean {
    const startDateHasError = this.ctlStartDate?.errors
      ? Object.keys(this.ctlStartDate.errors).some(key => key !== 'matDatepickerParse' && key !== 'matEndDateInvalid')
      : false;
    const endDateHasError = this.ctlEndDate?.errors
      ? Object.keys(this.ctlEndDate.errors).some(key => key !== 'matDatepickerParse' && key !== 'matEndDateInvalid')
      : false;

    // 確保對 dirty 或 touched 和 hasError 的條件處理不會返回 undefined
    return !!((this.ctlStartDate?.dirty || this.ctlStartDate?.touched) && startDateHasError) ||
           !!((this.ctlEndDate?.dirty || this.ctlEndDate?.touched) && endDateHasError);
  }

  getFirstError(): string {
    const startDateErrors = this.ctlStartDate?.errors;
    const endDateErrors = this.ctlEndDate?.errors;
    if (startDateErrors) {
      const filteredErrors = Object.entries(startDateErrors)
        .filter(([key]) => key !== 'required' && key !== 'matDatepickerParse' && key !== 'matEndDateInvalid')
        .map(([_, value]) => value as string); // 只取錯誤訊息

      // 取最後一個錯誤訊息
      return filteredErrors.length > 0 ? this.titleStart + filteredErrors[filteredErrors.length - 1] : ''
    }

    if (endDateErrors) {
      const filteredErrors = Object.entries(endDateErrors)
        .filter(([key]) => key !== 'required' && key !== 'matDatepickerParse' && key !== 'matEndDateInvalid')
        .map(([_, value]) => value as string); // 只取錯誤訊息

      // 取最後一個錯誤訊息
      return filteredErrors.length > 0 ? this.titleEnd + filteredErrors[filteredErrors.length - 1] : ''
    }

    return ''; // 如果沒有其他錯誤，則回傳空字串
  }

}
