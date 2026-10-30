import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./core/auth/login-page').then(m => m.LoginPage)
  },
  {
    path: 'solicitud-ausencia/:token',
    loadComponent: () => import('./features/solicitud-publica/solicitud-publica-page').then(m => m.SolicitudPublicaPage)
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/shell-layout').then(m => m.ShellLayout),
    canMatch: [
      () => import('./core/auth/auth.guard').then(m => m.authGuard)
    ],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/inicio/inicio.routes').then(m => m.INICIO_ROUTES)
      },
      {
        path: 'colaboradores',
        loadChildren: () => import('./features/colaboradores/colaboradores.routes').then(m => m.COLABORADORES_ROUTES)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
