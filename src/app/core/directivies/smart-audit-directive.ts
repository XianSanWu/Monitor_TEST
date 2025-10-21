import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { AuditActionService } from '../services/audit-action.service';

@Directive({
  selector: '[smartAudit]',
  standalone: true,
})
export class SmartAuditDirective {
  @Input('smartAudit') actionName!: string; // <-- 用 Input 綁定屬性

  constructor(private el: ElementRef, private auditSvc: AuditActionService) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log('MouseEvent', event);
    console.log('actionName', this.actionName);
    if (!this.actionName) return;
    this.auditSvc.set(this.actionName);
  }
}
