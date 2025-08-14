import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'token';

  // 儲存 token 到 sessionStorage
  setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  // 取得 token
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  // 移除 token
  clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  // 解碼 JWT 並取得 payload
  getTokenPayload(): any {
    const token = this.getToken();
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const payload = atob(parts[1]);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  }

  // 快速取得 userId（從 payload）
  getUserId(): number | null {
    const payload = this.getTokenPayload();
    return payload?.UserId ?? null;
  }

  // 快速取得 FeatureMask（從 payload）
  getFeatureMask(): number | null {
    const payload = this.getTokenPayload();
    return payload?.FeatureMask ?? null;
  }

  // 判斷是否登入
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
