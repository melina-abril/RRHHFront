import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * CanMatch guard para rutas protegidas: si no hay sesión, redirige a /login.
 */
export const authGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si ya hay un usuario autenticado, permite el acceso.
  if (auth.session()?.status === 'ready' && auth.session()?.data && auth.session()?.data.autorizado === true) {
    return true;
  }

  // Si se está cargando la sesión, muestra un loading simple (por UX real puede mejorarse)
  if (auth.session()?.status === 'loading') {
    // Devolver false o redirigir luego de espera, aquí false para bloqueo inmediato.
    return false;
  }

  // Redirige a login
  router.navigate(['/login']);
  return false;
};
