import { Component, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { AuditNameEnum } from "../core/enums/audit-name-enum";

@Component({ template: '' })
export abstract class BaseComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();
  AuditNameEnum = AuditNameEnum;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
