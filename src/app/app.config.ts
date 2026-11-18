import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localeEsAr from '@angular/common/locales/es-AR';
import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { apiErrorInterceptor } from './core/http/api-error.interceptor';
import { CurrentUser } from './core/session/current-user';
import { sessionExpiredInterceptor } from './core/session/session-expired.interceptor';
import { withSession } from './core/session/session.routes';
import { routes } from './app.routes';

registerLocaleData(localeEsAr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    // withSession: /login público y las rutas del sistema detrás de authGuard.
    // withComponentInputBinding: los parámetros de ruta (:id) y de query (?returnUrl) llegan como input() de la página.
    provideRouter(withSession(routes), withComponentInputBinding(), withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    // apiErrorInterceptor envuelve a sessionExpiredInterceptor: este ve el 401 crudo antes de que se traduzca a ApiProblemError.
    provideHttpClient(withFetch(), withInterceptors([apiErrorInterceptor, sessionExpiredInterceptor])),
    // Recupera la sesión (GET /auth/me) antes de resolver la primera ruta.
    provideAppInitializer(() => inject(CurrentUser).load()),
    { provide: LOCALE_ID, useValue: 'es-AR' },
  ],
};
