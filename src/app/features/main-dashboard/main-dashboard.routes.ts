import { Routes } from '@angular/router';

/** Pantalla principal con orientación sobre los módulos y accesos rápidos. */
export const MAIN_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () => import('./pages/home-page/home-page').then(m => m.HomePage),
  }
];
