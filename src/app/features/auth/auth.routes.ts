import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';

/**
 * Rutas del módulo de autenticación (login). Solo una ruta: '' para /login
 */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => Promise.resolve(LoginPage)
  }
];
