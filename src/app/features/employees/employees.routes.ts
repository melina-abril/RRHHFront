import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    title: 'Gestión de Empleados',
    loadComponent: () => import('./pages/employees-list-page/employees-list-page').then(m => m.EmployeesListPage),
  },
  {
    path: 'new',
    title: 'Alta de colaborador',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employee-create-page/employee-create-page').then(m => m.EmployeeCreatePage),
  },
  {
    path: ':id',
    title: 'Ficha individual de colaborador',
    loadComponent: () => import('./pages/employee-detail-page/employee-detail-page').then(m => m.EmployeeDetailPage),
  },
];
