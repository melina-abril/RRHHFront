import { Routes } from '@angular/router';

/** Rutas del módulo de autenticación: la ruta raíz muestra la pantalla customizada (con layout y avisos);
 * la ruta /login verdadera (de core/session) ya se expone en el router principal (withSession(routes)).
 */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    title: 'Inicio de sesión',
    loadComponent: () => import('./pages/login-page/login-page').then(m => m.AuthLoginPage),
  },
];
