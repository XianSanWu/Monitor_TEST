import { Routes } from '@angular/router';

export const routes: Routes = [
  //#region permission
  {
    path: 'permission_main',
    loadComponent: () => import('./main/main.component'),
  },
  {
    path: 'permission_detail/:Action',
    loadComponent: () => import('./detail/detail.component'),
  },
  {
    path: 'permission_detail/:Action/:UserName',
    loadComponent: () => import('./detail/detail.component'),
  },
  {
    path: 'permission_settings',
    loadComponent: () => import('./detail/detail.component'),
  },
  //#endregion
];
