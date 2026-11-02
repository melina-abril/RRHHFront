import { Routes } from '@angular/router';

/** withSession agrega el inicio de sesión y protege estas rutas. */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then((module) => module.DASHBOARD_ROUTES),
  },
  {
    path: 'employees',
    loadChildren: () => import('./features/employees/employees.routes').then((module) => module.EMPLOYEES_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
