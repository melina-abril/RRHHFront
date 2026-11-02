import { Routes } from '@angular/router';
import { roleGuard } from './core/session/role.guard';

/**
 * Rutas principales del sistema: una ruta lazy-load por módulo funcional.
 * El login no se declara aquí: lo pone withSession(routes) en app.config.ts.
 * El primer módulo es la ruta por defecto ('').
 */
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'employees',
    loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
  },
  {
    path: '**', redirectTo: '' }
];
