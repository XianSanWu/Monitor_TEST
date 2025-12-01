import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'number-center',
  standalone: true,
  templateUrl: './number-center.component.html',
  styleUrls: ['./number-center.component.scss']
})
export class NumberCenterComponent implements OnChanges {
  @Input() value: number = 0;
  @Input() textColor: string = '';

  // 新增標題
  @Input() titleTop: string = '';
  @Input() titleBottom: string = '';

  @Input() titleTopColor: string = '';
  @Input() titleBottomColor: string = '';

  displayValue: string = '';

  ngOnChanges() {
    this.displayValue = this.formatNumber(this.value);
  }

  formatNumber(num: number): string {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9)  return (num / 1e9 ).toFixed(1) + 'B';
    if (num >= 1e6)  return (num / 1e6 ).toFixed(1) + 'M';
    if (num >= 1e3)  return (num / 1e3 ).toFixed(1) + 'K';
    return num.toString();
  }
}

