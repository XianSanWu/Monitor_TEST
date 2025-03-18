import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnInit {
  @Input() title!: string;
  @Input() form!: FormGroup;
  @Input() ctlName!: string;
  @Input() mapList?: Map<string, string>;
  @Input() selectList?: { options: any; key: string | number; val: string } = { options: [], key: '', val: '' };
  @Input() disabledSelectList?: { options: any; key: string | number; val: string };
  @Input() enumName?: string;
  @Input() showPlaceholder?: string;
  @Input() popupText?: string;
  @Input() isMultiple?: boolean = false;
  @Input() placeholder: string = '請選擇';

  @Output() valueChange = new EventEmitter<any>();

  firstErr!: string;
  ctl!: FormControl;
  enumList = new Map();
  enumKey: string = '';

  get required() {
    return this.ctl?.validator?.({} as AbstractControl)?.['required'] !== undefined;
  }

  @ViewChild('selectListDropdown')
  selectListDropdown!: MatSelect;
  // @ViewChild('enumListDropdown')
  // enumListDropdown!: MatSelect;
  target: any;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  ngOnInit(): void {
    this.ctl = this.form.get(this.ctlName) as FormControl;

    if (this.mapList) {
      this.enumList = this.mapList;
    }

  }

  ngDoCheck(): void {
    if (this.ctl?.errors && !Object.values(this.ctl.errors)[0]) {
      this.firstErr = Object.values(this.ctl.errors)[0] as string;
    }
  }

  hasError() {
    return (this.ctl?.dirty || this.ctl?.touched) && this.ctl?.errors;
  }

  valueChangeFn(param?: any) {
    this.valueChange.next(param);
  }

  isOptionDisabled(optionKey: any): boolean {
    return this.disabledSelectList?.options?.some((option: { [x: string]: any; }) => option[this.disabledSelectList!.key] === optionKey) ?? false;
  }

  onSelectClick(event: Event, selectType: string): void {
    this.target = selectType === 'selectListDropdown' ? this.selectListDropdown : null; //this.enumListDropdown;

    setTimeout(() => {
      const elements = document.querySelectorAll('.cdk-overlay-connected-position-bounding-box');
      elements.forEach(element => {
        this.renderer[this.target.panelOpen ? 'addClass' : 'removeClass'](element, 'scrollFix');
      });
    }, 0);
  }
}
