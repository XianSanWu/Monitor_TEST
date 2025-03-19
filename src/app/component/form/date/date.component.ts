import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'date',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date.component.html',
  styleUrl: './date.component.scss'
})
export class DateComponent implements OnInit, AfterViewInit {
  @Input() form!: FormGroup;
  @Input() title: string = '選擇日期';
  @Input() disabled: boolean = false;
  @Input() ctlName: string = '';

  ctlDate: AbstractControl | null = null;

  constructor() { }

  get required(): boolean {
    return this.ctlDate?.validator ? this.ctlDate?.validator({} as AbstractControl)?.['required'] !== undefined : false;
  }

  ngOnInit() {
    if (!this.form) {
      throw new Error("FormGroup is required for DatePickerComponent");
    }
  }

  ngAfterViewInit() {
    this.setupControl();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['form']?.currentValue) {
      this.setupControl();
    }
  }

  private setupControl() {
    this.ctlDate = this.form.get(this.ctlName) as FormControl;
  }


  getFirstError(): string {
    const errors = this.ctlDate?.errors;
    // console.log('this.ctlDate',this.ctlDate)
    // console.log('this.ctlDate?.errors',errors)
    if (!errors) return '';

    // 過濾掉 'required' 和 'matDatepickerParse' 的錯誤
    const filteredErrors = Object.entries(errors)
      .filter(([key]) => key !== 'required' && key !== 'matDatepickerParse')
      .map(([_, value]) => value as string); // 只取錯誤訊息

    // 取最後一個錯誤訊息
    return filteredErrors.length > 0 ? filteredErrors[filteredErrors.length - 1] : '';
  }


  hasError(): boolean {
    return !!((this.ctlDate?.dirty || this.ctlDate?.touched) && this.ctlDate?.errors);
  }

}
