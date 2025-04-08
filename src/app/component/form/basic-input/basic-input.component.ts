import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'basic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './basic-input.component.html',
  styleUrl: './basic-input.component.scss'
})
export class BasicInputComponent implements OnInit {

  @Input() title: string = '';
  @Input() form!: FormGroup;
  @Input() ctlName: string = '';
  @Input() type: 'text' | 'password' | 'number' = 'text';
  @Input() placeholder: string = '請輸入';
  @Input() maxlength: number = 10;
  @Input() disabled: boolean = false;
  @Input() autocomplete: string = '';
  @Input() isHidden: boolean = false;

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
    // console.log('basic-input:', this.ctlName, this.form);
    this.updateControl();
  }

  private updateControl(): void {
    if (this.form && this.ctlName) {
      this.ctl = this.form.get(this.ctlName) as FormControl;
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
