import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { LoadingIndicatorComponent } from '../../../component/loading/loading-indicator/loading-indicator.component';

import { MatTooltipModule } from '@angular/material/tooltip';
import { FeaturePermission, GroupedPermissions } from '../../../core/models/responses/permission.model';
import { ConfigService } from '../../../core/services/config.service';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { BaseComponent } from '../../base.component';
import { PermissionManageService } from '../permission-manage.service';

@Component({
  selector: 'permission-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LoadingIndicatorComponent,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [LoadingService, PermissionManageService],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export default class DetailComponent extends BaseComponent implements OnInit {
  validateForm: FormGroup;
  public groupedPermissions: GroupedPermissions[] = [];
  public actions = ['Read', 'Create', 'Update', 'Delete'];

  allActions = ['Read', 'Create', 'Update', 'Delete'];

  constructor(
    // private dialog: MatDialog,
    private dialogService: DialogService,
    private permissionManageService: PermissionManageService,
    private configService: ConfigService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    super();
    // 初始化表單
    this.validateForm = new FormGroup({
      // channel: new FormControl(Channel.EDM, []),
    });

    this.configService.configData$.subscribe((data) => {});
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  // 保留你原本的 loadPermissions()
  loadPermissions() {
    this.loadingService.show();

    this.permissionManageService.GetPermissionListAsync().subscribe((res) => {
      if (res?.Data) {
        this.groupedPermissions = this.groupPermissions(res.Data);
      }
      this.loadingService.hide();
    });
  }

  groupPermissions(data: FeaturePermission[]): GroupedPermissions[] {
    const groups: GroupedPermissions[] = [];
    const headers = data.filter((x) => !x.ParentUuid);
    headers.forEach((header) => {
      const items = data.filter((x) => x.ParentUuid === header.Uuid);
      groups.push({ header, items });
    });
    return groups;
  }

  isActionEnabled(item: FeaturePermission, action: string): boolean {
    return item.Action === action;
  }
}
