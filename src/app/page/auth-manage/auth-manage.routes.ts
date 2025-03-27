import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth-login-verify/auth-login-verify.component'),
  }
];
