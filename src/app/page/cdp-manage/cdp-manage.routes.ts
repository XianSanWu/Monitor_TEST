import { Routes } from '@angular/router';

export const routes: Routes = [
  //#region APP_PUSH
  {
    path: 'app_push_main',
    loadComponent: () => import('./app-push/main/main.component'),
  },
  //#endregion

  //#region EDM
  {
    path: 'edm_main',
    loadComponent: () => import('./edm/main/main.component'),
  },
  {
    path: 'edm_detail/:BatchId/:SendUuidSort',
    loadComponent: () => import('./edm/detail/detail.component')
  },
  //#endregion

  //#region SMS
  {
    path: 'sms_main',
    loadComponent: () => import('./sms/main/main.component'),
  }
  //#endregion
];
