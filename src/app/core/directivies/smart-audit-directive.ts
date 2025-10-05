import { Directive, ElementRef, HostListener } from '@angular/core';
import { AuditActionService } from '../services/audit-action.service';

@Directive({
  selector: '[data-action]',
  standalone: true, 
})
export class SmartAuditDirective {
  constructor(private el: ElementRef, private auditSvc: AuditActionService) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log('MouseEvent',event)
    const actionName = this.el.nativeElement.getAttribute('data-action');
    console.log('actionName',actionName)
    if (!actionName) return;
    this.auditSvc.set(actionName);
  }
}
