import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const EMPLOYEE_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    title: 'Colaboradores',
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
    loadComponent: () => import('./pages/employee-detail-page/employee-detail-page').then((m) => m.EmployeeDetailPage),
  },
];
