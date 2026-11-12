import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    title: 'Inicio',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
];
