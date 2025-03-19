import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'test1',
    loadComponent: () => import('./test1/test1.component'),
  },
  {
    path: 'test2',
    loadComponent: () => import('./test2/test2.component'),
  }
];
