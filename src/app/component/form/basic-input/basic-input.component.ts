import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'basic-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
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

  // 新增 flag 控制密碼顯示
  showPassword: boolean = false;

  constructor() { }

  get required(): boolean {
    return this.ctl?.validator ? this.ctl?.validator({} as AbstractControl)?.['required'] !== undefined : false;
  }

  ngOnInit(): void {
    if (!this.autocomplete) {
      this.autocomplete = this.ctlName;
    }
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

  // getter 控制 input type
  get inputType(): 'text' | 'password' | 'number' {
    if (this.type === 'password' && this.showPassword) {
      return 'text';
    }
    return this.type;
  }

  // 切換密碼顯示
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
