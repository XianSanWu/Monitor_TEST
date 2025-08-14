import { Directive, ElementRef, Input, Renderer2 } from "@angular/core";
import { PermissionService } from "../../api/services/permission-service";

@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective {
  @Input('appHasPermission') required!: { module: string; feature: string; action: string };

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    const { module, feature, action } = this.required;
    const has = this.permissionService.hasPermission(module, feature, action);
    if (!has) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }
  }
}
