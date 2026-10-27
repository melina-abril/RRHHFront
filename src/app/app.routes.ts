import { Routes } from '@angular/router';
import { LoginPage } from './core/auth/login-page';

export const APP_ROUTES: Routes = [
  // Definición de las rutas principales de la aplicación. El router principal y la carga lazy de módulos van aquí.
  // 1. /login (pública), 2. /solicitud-ausencia/:token, 3. resto dentro del ShellLayout con canMatch authGuard, 4. ruta '' y '**' a inicio.
  {
    path: 'login',
    loadComponent: () => Promise.resolve(LoginPage)
  },
  {
    path: '',
    loadChildren: () => import('./features/inicio/inicio.routes').then(m => m.INICIO_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
