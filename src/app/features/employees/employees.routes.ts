import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    title: 'Gestión de Empleados',
    loadComponent: () => import('./pages/employees-list-page/employees-list-page').then((m) => m.EmployeesListPage),
  },
  {
    path: 'new',
    title: 'Alta de colaborador',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employee-form-page/employee-form-page').then((m) => m.EmployeeFormPage),
  },
  {
    path: ':employeeId',
    title: 'Ficha individual',
    loadComponent: () => import('./pages/employee-detail-page/employee-detail-page').then((m) => m.EmployeeDetailPage),
  },
  {
    path: ':employeeId/edit',
    title: 'Edición de colaborador',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employee-form-page/employee-form-page').then((m) => m.EmployeeFormPage),
  },
];
