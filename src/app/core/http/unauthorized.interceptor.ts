import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    // Maneja 401: limpia la sesión y navega a login
    // Usar catchError de 'rxjs/operators'
    // No importa localmente porque arquitecturas reales traen este import en un archivo base
    // Aquí agregamos el mínimo necesario
    catchError((error) => {
      if (error?.status === 401) {
        auth.clearSession();
        router.navigateByUrl('/login');
      }
      throw error;
    })
  );
};

// Necesario para compilar: importar catchError correctamente
import { catchError } from 'rxjs/operators';
