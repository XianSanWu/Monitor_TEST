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
    const startDateHasError = this.ctlStartDate?.dirty || this.ctlStartDate?.touched && this.ctlStartDate?.errors;
    const endDateHasError = this.ctlEndDate?.dirty || this.ctlEndDate?.touched && this.ctlEndDate?.errors;
    return !!(startDateHasError || endDateHasError);
  }

  getFirstError(): string {
    const startDateErrors = this.ctlStartDate?.errors;
    const endDateErrors = this.ctlEndDate?.errors;
    // console.info('startDateErrors',startDateErrors)
    // console.info('endDateErrors',endDateErrors)
    if (this.form.errors?.['dateErrMsg']) {
      return this.form.errors['dateErrMsg']; // 父層驗證
    }

    if (this.form.errors?.['endDateBeforeToday']) {
      return this.form.errors['endDateBeforeToday']; // 父層驗證
    }

    // 檢查起始日期錯誤，並排除 'required' 錯誤
    if (startDateErrors) {
      // 移除 'required' 錯誤
      delete startDateErrors['required'];
      if (Object.keys(startDateErrors).length > 0) {
        return this.titleStart + ' ' + Object.values(startDateErrors)[0];
      }
    }

    // 檢查結束日期錯誤，並排除 'required' 錯誤
    if (endDateErrors) {
      // 移除 'required' 錯誤
      delete endDateErrors['required'];
      if (Object.keys(endDateErrors).length > 0) {
        // 若有其他錯誤，顯示其他錯誤
        return this.titleEnd + ' ' + Object.values(endDateErrors)[0];
      }
    }

    return ''; // 如果沒有其他錯誤，則回傳空字串
  }




}
