import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
// import { LoadingIndicatorComponent } from '../../component/loading/loading-indicator/loading-indicator.component';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    // LoadingIndicatorComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class LayoutComponent implements OnInit {
  opened = true; // 側邊欄是否打開
  isSmallScreen = false;

  constructor() { }

  ngOnInit() {
    this.onResize(null);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const currentIsSmallScreen = window.innerWidth <= 768;
    if (currentIsSmallScreen !== this.isSmallScreen) {
      this.isSmallScreen = currentIsSmallScreen;
      this.opened = !this.isSmallScreen; // 小螢幕預設關閉，大螢幕保持開啟
    }
    // console.log('this.isSmallScreen', this.isSmallScreen);
    // console.log('this.opened', this.opened);
  }

  toggleSidenav() {
    this.opened = !this.opened;
  }

  onMenuItemClick() {
    console.log('onMenuItemClick', this.isSmallScreen)
    if (this.isSmallScreen) {
      this.opened = false;
    }
  }
}
