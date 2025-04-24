import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { MenuItem } from '../../core/models/common/menu.model';

export const OtherMenu: MenuItem[] = [
  {
    title: "CDP工作流程管理", icon: "list", link: '',
    children: [
      { title: "EDM", icon: "envelope-open-fill", link: "/cdp/edm_main", children: [] },
      { title: "SMS", icon: "chat-fill", link: "/cdp/sms_main", children: [] },
      { title: "APP_PUSH", icon: "bell-fill", link: "/cdp/app_push_main", children: [] },
    ]
  },
  {
    title: "MSMQ", icon: "list", link: '',//Microsoft Message Queuing
    children: [
      { title: "訊息佇列系統", icon: "gear", link: "/msmq/queue", children: [] },
    ]
  },

];

export const AdminMenu: MenuItem[] = [
  { title: "首頁管理", icon: "house-door", link: "/home", children: [] },
  //#region 測試
  // { title: "登入管理", icon: "lock", link: "/login", children: [] },
  // {
  //   title: "測試管理", icon: "gear", link: '',
  //   children: [
  //     { title: "測試1", icon: "file-earmark-text", link: "/test/test1", children: [] },
  //     { title: "測試2", icon: "file-earmark-text", link: "/test/test2", children: [] },
  //   ]
  // },
  //#endregion
  ...OtherMenu,
  {
    title: "Mail Hunter 報表", icon: "list", link: '',
    children: [
      { title: "年度統計報表", icon: "file-earmark-text-fill", link: "/mailhunter/project_mail_count", children: [] },
    ]
  },
];

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SidebarComponent implements OnInit {
  @Input() opened!: boolean;
  @Input() isSmallScreen!: boolean;
  @Output() menuItemClicked = new EventEmitter<void>();

  menuItems!: MenuItem[];

  constructor(private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // console.log('SSSS.isSmallScreen', this.isSmallScreen);
    // console.log('SSSS.opened', this.opened);
    const user = this.localStorageService.getItem('isLoggedIn')?.toLocaleLowerCase();
    this.menuItems = (user === 'admin') ? Object.values(AdminMenu) : Object.values(OtherMenu);
    // console.log('SSSS.user', user);
    // console.log('SSSS.menuItems', this.menuItems);
    this.cd.detectChanges();
  }

  onMenuItemClick() {
    if (this.isSmallScreen && this.opened) {
      this.menuItemClicked.emit();
    }
  }
}
