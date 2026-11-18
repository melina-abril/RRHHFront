import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { CurrentUser } from './current-user';

/** canMatch de la app: sin sesión va al login y vuelve a la misma pantalla después de entrar. */
export const authGuard: CanMatchFn = (_route, segments) => {
  if (inject(CurrentUser).isAuthenticated()) return true;
  const returnUrl = '/' + segments.map((segment) => segment.path).join('/');
  return inject(Router).createUrlTree(['/login'], returnUrl === '/' ? {} : { queryParams: { returnUrl } });
};

/** canMatch del login: con sesión no tiene sentido verlo, va al inicio. */
export const guestGuard: CanMatchFn = () => (inject(CurrentUser).isAuthenticated() ? inject(Router).createUrlTree(['/']) : true);
