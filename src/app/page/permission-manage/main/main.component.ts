import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '../../base.component';
import { ConfigService } from '../../../core/services/config.service';
import { DialogService } from '../../../core/services/dialog.service';
import { LoadingService } from '../../../core/services/loading.service';
import { PermissionManageService } from '../permission-manage.service';

@Component({
  selector: 'permission-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export default class MainComponent  extends BaseComponent implements OnInit {
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

    this.configService.configData$.subscribe(data => {
    });
  }

  validateForm: FormGroup;

  ngOnInit() {
    this.loadPermissions();
  }

  loadPermissions() {
    // this.permissionManageService.getSearchList().subscribe(data => this.permissions = data);
  }

  delete(id: string) {
    if (confirm('確定刪除這筆權限？')) {
      // this.permissionService.delete(id).subscribe(() => this.loadPermissions());
    }
  }
}

