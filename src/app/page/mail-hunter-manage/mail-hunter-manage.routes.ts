import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'project_mail_count',
    loadComponent: () => import('./project-mail-count/project-mail-count.component'),
  },
  // {
  //   path: 'sms',
  //   loadComponent: () => import('./sms/sms.component'),
  // }
];
