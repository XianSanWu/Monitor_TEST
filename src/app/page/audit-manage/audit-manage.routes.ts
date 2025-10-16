import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'audit_main',
    data: { breadcrumb: '稽核管理_主頁' },
    loadComponent: () => import('./main/main.component'),
  },
];
