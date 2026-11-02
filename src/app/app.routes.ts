import { Routes } from '@angular/router';
import { roleGuard } from './core/session/role.guard';

/**
 * Rutas principales del sistema (una por módulo).
 *
 * No agrega guards de sesión ni /login; eso lo monta withSession(routes) en app.config.ts.
 * La primera es la ruta por defecto y '**' redirige a ella.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    canMatch: [roleGuard('ADMIN_RRHH')],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    title: 'Inicio'
  },
  {
    path: 'employees',
    canMatch: [roleGuard('ADMIN_RRHH')],
    loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES),
    title: 'Gestión de Empleados'
  },
  { path: '**', redirectTo: '' }
];
