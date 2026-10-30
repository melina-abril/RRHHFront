import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * CanMatch guard para rutas protegidas: si no hay sesión, redirige a /login.
 */
export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si el usuario está autenticado, permite el acceso.
  if (auth.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, redirige a /login.
  router.navigate(['/login']);
  return false;
};
