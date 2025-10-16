import { Routes } from '@angular/router';
import { AuthGuard } from './common/guard/auth.guard';
import { LayoutComponent } from './theme/layout/layout.component';
// import LoginComponent from './page/login-manage/login-verify/login-verify.component';

export const routes: Routes = [
  // component: LayoutComponent,  // 主要佈局頁面
  // canActivate: [AuthGuard],  // 使用 AuthGuard 進行授權檢查
  {
    path: 'login',
    loadChildren: () => import('./page/auth-manage/auth-manage.routes').then(m => m.routes),
  },
  {
    path: 'test',
    component: LayoutComponent,  // 主要佈局頁面
    canActivate: [AuthGuard],    // 使用 AuthGuard 進行授權檢查
    loadChildren: () => import('./page/test-manage/test-manage.routes').then(m => m.routes),
  },
  {
    path: 'audit',
    component: LayoutComponent,  // 主要佈局頁面
    canActivate: [AuthGuard],    // 使用 AuthGuard 進行授權檢查
    loadChildren: () => import('./page/audit-manage/audit-manage.routes').then(m => m.routes),
  },
  {
    path: 'cdp',
    component: LayoutComponent,  // 主要佈局頁面
    canActivate: [AuthGuard],    // 使用 AuthGuard 進行授權檢查
    loadChildren: () => import('./page/cdp-manage/cdp-manage.routes').then(m => m.routes),
  },
  {
    path: 'mailhunter',
    component: LayoutComponent,  // 主要佈局頁面
    canActivate: [AuthGuard],    // 使用 AuthGuard 進行授權檢查
    loadChildren: () => import('./page/mail-hunter-manage/mail-hunter-manage.routes').then(m => m.routes),
  },
  {
    path: 'msmq',
    component: LayoutComponent,  // 主要佈局頁面
    canActivate: [AuthGuard],    // 使用 AuthGuard 進行授權檢查
    loadChildren: () => import('./page/msmq-manage/msmq-manage.routes').then(m => m.routes),
  },
  {
    path: 'permission',
    component: LayoutComponent,  // 主要佈局頁面
    canActivate: [AuthGuard],    // 使用 AuthGuard 進行授權檢查
    loadChildren: () => import('./page/permission-manage/permission-manage.routes').then(m => m.routes),
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


