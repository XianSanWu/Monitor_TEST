import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'queue',
    loadComponent: () => import('./queue/queue.component'),
  },
];
