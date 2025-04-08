import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'edm',
    loadComponent: () => import('./edm/edm.component'),
  },
  {
    path: 'sms',
    loadComponent: () => import('./sms/sms.component'),
  }
];
