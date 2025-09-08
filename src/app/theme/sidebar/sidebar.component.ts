import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../../core/models/common/menu.model';
import {
  FeaturePermission,
  GroupedPermissions,
} from '../../core/models/responses/permission.model';
import { ConfigService } from '../../core/services/config.service';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
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

  constructor(
    private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    const permissions = JSON.parse(
      this.localStorageService.getItem('userPermissionsMenu') ?? '[]'
    );
    // console.log('permissions', permissions);

    this.menuItems = this.transformMenu(this.groupPermissions(permissions));
    // console.log('menuItems', this.menuItems);

    this.cd.detectChanges();
  }

  // 轉成menu
  transformMenu(raw: GroupedPermissions[]): MenuItem[] {
    return raw.map((r) => {
      const children = r.items
        .filter((item) => item.IsUse && item.IsVisible) // 只保留啟用且可見的項目
        .map((item) => ({
          title: item.Title,
          icon: item.Icon ?? '', // 若 icon 為 null，給空字串
          link: item.Link ?? undefined,
          bitValue: item.BitValue ?? 0,
        }));

      return {
        title: r.header.Title,
        icon: r.header.Icon ?? '',
        link: r.header.Link ?? undefined,
        bitValue: r.header.BitValue ?? 0,
        children: children.length > 0 ? children : undefined,
      };
    });
  }

  // 整理資料為UI可視化
  groupPermissions(data: FeaturePermission[]): GroupedPermissions[] {
    // 先挑出所有 header，並依 Sort 排序
    const headers = data
      .filter((x) => !x.ParentUuid || x.BitValue === 0)
      .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0));

    const groups: GroupedPermissions[] = [];

    headers.forEach((header) => {
      // 每個 header 下的 items 依 Sort 排序
      const items = data
        .filter((x) => x.ParentUuid === header.Uuid)
        .sort((a, b) => (a.Sort ?? 0) - (b.Sort ?? 0))
        .map((item) => {
          return { ...item };
        });

      groups.push({ header, items });
    });
    // console.log('groups', groups);
    return groups;
  }

  onMenuItemClick() {
    if (this.isSmallScreen && this.opened) {
      this.menuItemClicked.emit();
    }
  }
}
