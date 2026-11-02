import { Routes } from '@angular/router';

/** Pantalla principal: única ruta, sin parámetros. */
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () => import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
];
