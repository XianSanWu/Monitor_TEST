import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
// import { authInterceptor } from './api/Interceptors/auth/auth-interceptor';
import { httpRequestInterceptor } from './api/Interceptors/error/http-request-interceptor';
import { routes } from './app.routes';
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'zh-TW' }, // 設定台灣語系
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    // provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([httpRequestInterceptor, ])//authInterceptor
    ),
  ],
};
