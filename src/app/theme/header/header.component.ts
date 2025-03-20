import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class HeaderComponent {
  @Input() isSmallScreen!: boolean;

  @Output() toggleSidenavEvent = new EventEmitter<void>();

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
  ) { }

  logout() {
    this.localStorageService.clear();
    this.router.navigate(['/login']);
  }

  toggleSidenav() {
    this.toggleSidenavEvent.emit();
  }
}
