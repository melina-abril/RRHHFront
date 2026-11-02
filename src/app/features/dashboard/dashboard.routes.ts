import { Routes } from '@angular/router';

/**
 * Rutas del módulo: solo una página inicial (dashboard-page).
 */
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () => import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage)
  }
];
