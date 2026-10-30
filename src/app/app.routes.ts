import { Routes } from '@angular/router';
import { LoginPage } from './core/auth/login-page';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => Promise.resolve(LoginPage)
  },
  // NOTA: la página 'solicitud-publica/solicitud-publica-page' no está generada. Comenta o elimina su uso del router hasta que exista su implementación real.
  // {
  //   path: 'solicitud-ausencia/:token',
  //   loadComponent: () => Promise.resolve(SolicitudPublicaPage)
  // },
  // NOTA: los siguientes imports tampoco existen (ShellLayout, authGuard). Comentar/ajustar hasta que esas piezas sean implementadas.
  // {
  //   path: '',
  //   loadComponent: () => Promise.resolve(ShellLayout),
  //   canMatch: [authGuard],
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./features/inicio/inicio.routes').then(m => m.INICIO_ROUTES)
  //     }
  //     // Aquí se agregarán los loadChildren de los módulos funcionales a medida que se implementen.
  //   ]
  // },
  {
    path: '**',
    redirectTo: 'login'
  }
];
