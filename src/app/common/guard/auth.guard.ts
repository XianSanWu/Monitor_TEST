import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { TokenService } from '../../api/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    // private authService: AuthService,
    private tokenService: TokenService
  ) {}

  canActivate(): boolean {
    // 需有Token
    if (!!this.tokenService.getTokenUuid()) {
      return true;
    } else {
      return false;
    }
  }
}
