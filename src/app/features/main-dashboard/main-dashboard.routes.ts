import { Routes } from '@angular/router';

export const MAIN_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    title: 'Inicio',
    loadComponent: () => import('./pages/main-dashboard-page/main-dashboard-page').then((m) => m.MainDashboardPage),
  }
];
