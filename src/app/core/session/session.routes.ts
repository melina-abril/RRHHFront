import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth.guard';

/**
 * Envuelve las rutas del sistema (app.routes.ts) con la sesión: /login es pública y todo lo demás pide sesión.
 * app.routes.ts no sabe nada de esto: solo declara sus módulos.
 */
export function withSession(routes: Routes): Routes {
  return [
    { path: 'login', canMatch: [guestGuard], loadComponent: () => import('./login-page').then((m) => m.LoginPage), title: 'Iniciar sesión' },
    { path: '', canMatch: [authGuard], children: routes },
    { path: '**', redirectTo: 'login' },
  ];
}
