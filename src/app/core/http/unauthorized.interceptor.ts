import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';

export const unauthorizedInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      if (error?.status === 401) {
        auth.logout();
        router.navigateByUrl('/login');
      }
      throw error;
    })
  );
};
