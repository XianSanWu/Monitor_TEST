import { Routes } from '@angular/router';

export const routes: Routes = [
  // APP_PUSH
  {
    path: 'app_push_main',
    loadComponent: () => import('./app-push/main/main.component'),
  },

  // EDM
  {
    path: 'edm_main',
    loadComponent: () => import('./edm/main/main.component'),
  },
  {
    path: 'edm_detail/:BatchId/:SendUuidSort',
    loadComponent: () => import('./edm/detail/detail.component'),
  },
  // SMS
  {
    path: 'sms_main',
    loadComponent: () => import('./sms/main/main.component'),
  },
];
