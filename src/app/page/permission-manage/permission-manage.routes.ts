import { Routes } from '@angular/router';

export const routes: Routes = [
  //#region permission
  {
    path: 'permission_main',
    loadComponent: () => import('./main/main.component'),
  },
  //#endregion


];
