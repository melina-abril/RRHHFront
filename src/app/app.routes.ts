import type { Routes } from '@angular/router';
import { roleGuard } from './core/session/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'employees',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/employee-management/employee-management.routes').then(m => m.EMPLOYEE_MANAGEMENT_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
