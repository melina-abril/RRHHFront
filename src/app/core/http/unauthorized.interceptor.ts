import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).catch((err: unknown) => {
    if (err instanceof HttpErrorResponse && err.status === 401) {
      // Limpia la sesión y navega a /login
      // Se puede expandir para limpiar signals de sesión si están disponibles en el contexto
      router.navigateByUrl('/login');
    }
    throw err;
  });
};
