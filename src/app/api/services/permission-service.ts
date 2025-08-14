import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { PermissionResponse } from "../../core/models/responses/permission.model";

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissions: PermissionResponse[] = [];

  constructor(private http: HttpClient) {}

  loadPermissions(): Observable<PermissionResponse[]> {
    return this.http.get<PermissionResponse[]>('/api/permissions').pipe(
      tap(perms => (this.permissions = perms))
    );
  }

  hasPermission(module: string, feature: string, action: string): boolean {
    return this.permissions.some(p =>
      p.ModuleName === module && p.FeatureName === feature && p.Action === action
    );
  }

  hasAnyPermission(requirements: { module: string; feature: string; action: string }[]): boolean {
    return requirements.some(r => this.hasPermission(r.module, r.feature, r.action));
  }
}
