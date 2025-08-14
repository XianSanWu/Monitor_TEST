import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './core/services/auth.service';
import { ConfigService } from './core/services/config.service';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
  ],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Monitor';
  isLoggedIn = false;
  // apiBaseUrl = environment.apiBaseUrl; // <-- 在這裡暴露變數給樣板用
  environmentName = environment.Environment; // 環境變數

  constructor(
    private configService: ConfigService,
    public authService: AuthService,
    public loadingService: LoadingService,
    public router: Router
  ) {
     router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo({ top: 0 });
    });
  }

  ngOnInit(): void {
    // console.log(environment.apiBaseUrl);

    this.configService.loadConfig().subscribe({
      next: (data) => {
        // console.log('Configuration loaded in AppComponent:', data);
      },
      error: (err) => {
        console.error('Error loading configuration:', err);
      }
    });
  }

}
