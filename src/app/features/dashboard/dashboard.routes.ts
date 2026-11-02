import { Routes } from '@angular/router';

/** Pantalla de inicio: solo una ruta, sin guards. */
export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () => import('./pages/dashboard-page/dashboard-page').then(m => m.DashboardPage),
  },
];
