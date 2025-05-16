import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { MenuItem } from '../../core/models/common/menu.model';
import { ConfigService } from '../../core/services/config.service';

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
  testMenu!: MenuItem[];
  adminMenu!: MenuItem[];
  otherMenu!: MenuItem[];

  constructor(
    private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef,
    private configService: ConfigService,
  ) {
    this.configService.configData$.subscribe(data => {
      this.testMenu = data?.testMenu;
      this.otherMenu = data?.otherMenu;
      this.adminMenu = [...(data?.adminMenu ?? []), ...(this?.otherMenu ?? []), ...(this.testMenu ?? [])];
    });
  }

  ngOnInit(): void {
    // console.log('SSSS.isSmallScreen', this.isSmallScreen);
    // console.log('SSSS.opened', this.opened);
    const user = this.localStorageService.getItem('isLoggedIn')?.toLocaleLowerCase();
    this.menuItems = (user === 'admin') ? Object.values(this.adminMenu) : Object.values(this.otherMenu);
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
