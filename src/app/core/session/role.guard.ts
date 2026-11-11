import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { CurrentUser } from './current-user';

/** canMatch de una ruta según el rol del usuario actual; si no lo tiene vuelve al inicio. Uso: canMatch: [roleGuard('SELLER', 'ADMIN')]. */
export function roleGuard(...roles: string[]): CanMatchFn {
  return () => (inject(CurrentUser).hasRole(roles) ? true : inject(Router).createUrlTree(['/']));
}
