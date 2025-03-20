import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { MenuItem } from '../../core/models/common/menu.model';

//icon: "file-text-outline","lock-outline","settings-outline"

export const AdminMenu: MenuItem[] = [
  { title: "首頁管理", icon: "house-door", link: "/home", children: [] },
  { title: "登入管理", icon: "lock", link: "/login", children: [] },
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SidebarComponent implements OnInit {
  activeGroups: Set<string> = new Set();
  menuItems!: MenuItem[];

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit() {
    const user = this.localStorageService.getItem('isLoggedIn')?.toLocaleLowerCase();
    this.menuItems = (user === 'admin') ?
      Object.values(AdminMenu) : Object.values(OtherMenu);
  }

  logout() {
    this.localStorageService.clear();
    this.router.navigate(['/login']);
  }
}
