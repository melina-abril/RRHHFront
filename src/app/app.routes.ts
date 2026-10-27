import { Routes } from '@angular/router';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { ShellLayout } from './core/layout/shell-layout';
import { authGuard } from './core/auth/auth.guard';

export const APP_ROUTES: Routes = [
  // Definición de las rutas principales de la aplicación. El router principal y la carga lazy de módulos van aquí.
  // 1. /login (pública), 2. /solicitud-ausencia/:token, 3. resto dentro del ShellLayout con canMatch authGuard, 4. ruta '' y '**' a inicio.
  {
    path: 'login',
    loadComponent: () => Promise.resolve(LoginPage)
  },
  {
    path: 'solicitud-ausencia/:token',
    loadComponent: () => import('./features/solicitud-publica/solicitud-publica-page').then(m => m.SolicitudPublicaPage)
  },
  {
    path: '',
    loadComponent: () => Promise.resolve(ShellLayout),
    canMatch: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/inicio/inicio.routes').then(m => m.INICIO_ROUTES)
      }
      // Aquí se agregarán los loadChildren de los módulos funcionales a medida que se implementen.
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
