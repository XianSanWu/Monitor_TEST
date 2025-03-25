import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { MenuItem } from '../../core/models/common/menu.model';
export const AdminMenu: MenuItem[] = [
  { title: "首頁管理", icon: "house-door", link: "/home", children: [] },
  { title: "登入管理", icon: "lock", link: "/login", children: [] },
  {
    title: "測試管理", icon: "gear", link: '',
    children: [
      { title: "測試1", icon: "file-earmark-text", link: "/test/test1", children: [] },
      { title: "測試2", icon: "file-earmark-text", link: "/test/test2", children: [] },
    ]
  },
  {
    title: "測試管理", icon: "gear", link: '',
    children: [
      { title: "測試1", icon: "file-earmark-text", link: "/test/test1", children: [] },
      { title: "測試2", icon: "file-earmark-text", link: "/test/test2", children: [] },
    ]
  }
];


export const OtherMenu: MenuItem[] = [
  // { title: "首頁管理", icon: "house-door", link: "/home", children: [] },
  { title: "登入管理", icon: "lock", link: "/login", children: [] },
  {
    title: "測試管理", icon: "gear", link: '',
    children: [
      { title: "測試1", icon: "file-earmark-text", link: "/test/test1", children: [] },
      // { title: "測試2", icon: "file-earmark-text", link: "/test/test2", children: [] },
    ]
  }
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
