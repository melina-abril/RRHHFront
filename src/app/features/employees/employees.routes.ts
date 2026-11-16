import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    title: 'Buscar colaboradores',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employees-page/employees-page').then((m) => m.EmployeesPage),
  },
];
