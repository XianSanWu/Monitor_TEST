import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'collapsible-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible-section.component.html',
  styleUrls: ['./collapsible-section.component.scss']
})
export class CollapsibleSectionComponent {
  @Input() title: string = '區塊標題';
  @Input() tooltipText?: string;
  @Input() isOpen: boolean = true;
  @Input() isTooltipOpen: boolean = false;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  tooltipToggle() {
    this.isTooltipOpen = !this.isTooltipOpen;
  }

}
