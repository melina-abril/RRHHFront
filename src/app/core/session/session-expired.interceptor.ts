import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { CurrentUser } from './current-user';

/** Un 401 de la API (no de login ni de /me) es una sesión vencida: se cierra y vuelve al login. */
export const sessionExpiredInterceptor: HttpInterceptorFn = (request, next) => {
  const currentUser = inject(CurrentUser);
  const router = inject(Router);
  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401 && !/\/auth\/(login|me)$/.test(request.url) && currentUser.isAuthenticated()) {
        currentUser.clear();
        void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    }),
  );
};
