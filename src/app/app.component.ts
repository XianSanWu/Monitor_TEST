import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
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

  constructor(
    private configService: ConfigService,
    public authService: AuthService,
    public loadingService: LoadingService
  ) { }

  ngOnInit(): void {
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
