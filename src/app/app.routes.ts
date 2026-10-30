import { Routes } from '@angular/router';
import { roleGuard } from './core/session/role.guard';
import { MAIN_DASHBOARD_ROUTES } from './features/main-dashboard/main-dashboard.routes';
import { EMPLOYEES_ROUTES } from './features/employees/employees.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'main-dashboard', pathMatch: 'full' },
  {
    path: 'main-dashboard',
    loadChildren: () => import('./features/main-dashboard/main-dashboard.routes').then(m => m.MAIN_DASHBOARD_ROUTES),
    title: 'Principal'
  },
  {
    path: 'employees',
    loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES),
    title: 'Gestión de empleados'
  },
  { path: '**', redirectTo: '' }
];
