import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'edm_main',
    loadComponent: () => import('./edm/main/main.component'),
  },
  {
    path: 'edm_senduuid_detail/:BatchId/:SendUuidSort',
    loadComponent: () => import('./edm/senduuid-detail/senduuid-detail.component'),
  },
  // {
  //   path: 'sms',
  //   loadComponent: () => import('./sms/sms.component'),
  // }
];
