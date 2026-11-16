import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    title: 'Colaboradores',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employees-page/employees-page').then((m) => m.EmployeesPage),
  },
  {
    path: 'new',
    title: 'Nuevo colaborador',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employee-form-page/employee-form-page').then((m) => m.EmployeeFormPage),
  },
  {
    path: ':id',
    title: 'Ficha del colaborador',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employee-detail-page/employee-detail-page').then((m) => m.EmployeeDetailPage),
  },
];
