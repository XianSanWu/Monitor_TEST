import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage.service';

@Component({
  selector: 'collapsible-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collapsible-section.component.html',
  styleUrls: ['./collapsible-section.component.scss']
})
export class CollapsibleSectionComponent implements OnInit {
  constructor(
    private localStorageService: LocalStorageService,
  ) { }

  @Input() id!: string;  // 每個 section 都有唯一 id
  @Input() title: string = '區塊標題';
  @Input() tooltipText?: string;
  isOpen: boolean = true;
  @Input() isTooltipOpen: boolean = false;

  ngOnInit() {
    const stored = this.localStorageService.getItem(this.getStorageKey());
    if (stored !== null) {
      this.isOpen = stored === 'true';
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    this.localStorageService.setItem(this.getStorageKey(), this.isOpen.toString());
  }

  tooltipToggle() {
    this.isTooltipOpen = !this.isTooltipOpen;
  }

  private getStorageKey(): string {
    return `collapsible-section-${this.id}`;
  }
}
