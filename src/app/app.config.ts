import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/platform-browser';
import { APP_ROUTES } from './app.routes';
import { credentialsInterceptor } from './core/http/credentials.interceptor';
import { unauthorizedInterceptor } from './core/http/unauthorized.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        credentialsInterceptor,
        unauthorizedInterceptor
      ])
    )
  ]
};
