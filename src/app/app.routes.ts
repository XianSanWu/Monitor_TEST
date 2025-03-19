import { Routes } from '@angular/router';
import { AuthGuard } from './common/guard/auth.guard';
import { LayoutComponent } from './theme/layout/layout.component';
// import LoginVerifyComponent from './page/login-manage/login-verify/login-verify.component';

export const routes: Routes = [
  // component: LayoutComponent,  // 主要佈局頁面
  // canActivate: [AuthGuard],  // 使用 AuthGuard 進行授權檢查
  {
    path: 'login',
    loadChildren: () => import('./page/login-manage/login-manage.routes').then(m => m.routes),
  },
  {
    path: 'test',
    component: LayoutComponent,  // 主要佈局頁面
    canActivate: [AuthGuard],    // 使用 AuthGuard 進行授權檢查
    loadChildren: () => import('./page/test-manage/test-manage.routes').then(m => m.routes),
  },
  {
    path: 'home',
    component: LayoutComponent,  // 主要佈局頁面
    canActivate: [AuthGuard],    // 使用 AuthGuard 進行授權檢查
    loadChildren: () => import('./page/home-manage/home-manage.routes').then(m => m.routes),
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];


