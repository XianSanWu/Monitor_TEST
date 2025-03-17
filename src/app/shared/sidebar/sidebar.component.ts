import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { MenuItem } from '../../core/models/common/menu.model';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];
  activeGroups: Set<string> = new Set();

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    // 只在初始化時設置 menuItems
    this.menuItems = this.getMenuItems(this.router.config);
    // console.log('Initial Menu Items:', this.menuItems);
    // this.cdr.detectChanges();
  }

  getMenuItems(routes: Routes): MenuItem[] {
    let menuItems: MenuItem[] = [];

    routes.forEach(route => {
      if (route.children) {
        route.children.forEach(rc => {
          menuItems.push(this.createMenuItem(route, rc));
        });
      } else if (route.data) {
        menuItems.push(this.createMenuItem(route));
      }
    });

    return menuItems;
  }

  createMenuItem(route: any, rc?: any): MenuItem {
    const parentPath = route.data?.['fullPath'] ? route.data?.['fullPath'] : route.path ? `/${route.path}` : '';  // 確保不會出現雙斜線
    return {
      path: rc ? `${parentPath}/${rc.path}` : parentPath,  // 確保 path 是完整的
      title: rc ? rc.data?.['title'] : route.data?.['title'] || '',
      icon: rc ? rc.data?.['icon'] : route.data?.['icon'] || '',
      children: rc && rc.children ? this.getMenuItems(rc.children) : []
    };
  }

  toggleGroup(item: MenuItem) {
    if (this.activeGroups.has(item.title!)) {
      this.activeGroups.delete(item.title!);
    } else {
      this.activeGroups.add(item.title!);
    }
  }

  isGroupActive(item: MenuItem): boolean {
    return this.activeGroups.has(item.title!);
  }

  logout() {
    this.localStorageService.clear();
    this.router.navigate(['/login']);
  }
}
