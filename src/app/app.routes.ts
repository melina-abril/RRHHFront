import { Routes } from '@angular/router';
import { roleGuard } from './core/session/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'employees' },
  {
    path: 'employees',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES),
  },
  {
    path: 'dashboard',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
