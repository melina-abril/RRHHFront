import { Routes } from '@angular/router';
import { roleGuard } from './core/session/role.guard';
import { MAIN_DASHBOARD_ROUTES } from './features/main-dashboard/main-dashboard.routes';
import { EMPLOYEES_ROUTES } from './features/employees/employees.routes';

/**
 * Rutas principales de la app (sin /login ni guards de sesión: los agrega withSession en app.config.ts).
 * Cada módulo exporta su constante de rutas y se monta con loadChildren; el primero es la ruta por defecto.
 */
export const routes: Routes = [
  { path: '', redirectTo: 'main-dashboard', pathMatch: 'full' },
  {
    path: 'main-dashboard',
    loadChildren: () => import('./features/main-dashboard/main-dashboard.routes').then(m => m.MAIN_DASHBOARD_ROUTES),
    canMatch: [roleGuard('ADMIN_RRHH')]
  },
  {
    path: 'employees',
    loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES),
    canMatch: [roleGuard('ADMIN_RRHH')]
  },
  { path: '**', redirectTo: '' }
];
