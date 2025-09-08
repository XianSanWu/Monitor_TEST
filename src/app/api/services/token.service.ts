import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
   private readonly ACCESS_TOKEN_UUID_KEY = 'accessTokenUuid';

  // 儲存 TokenUuid（非 JWT，前端可用）
  setTokenUuid(tokenUuid: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_UUID_KEY, tokenUuid);
  }

  getTokenUuid(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_UUID_KEY);
  }

  clearTokenUuid(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_UUID_KEY);
  }
}
