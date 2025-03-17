import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private readonly STORAGE_KEY = 'auth_token'; // 儲存用戶認證的 key

  constructor(
    private localStorageService: LocalStorageService,
  ) { }

  logout(): void {
    this.localStorageService.clear();
  }

  // 檢查用戶是否已登入
  isAuthenticated(): boolean {
    return this.localStorageService.getItem('isLoggedIn') === 'true';
  }
}
