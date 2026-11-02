import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    title: 'Gestión de Empleados',
    loadComponent: () => import('./pages/employees-page/employees-page').then((m) => m.EmployeesPage),
  },
  {
    path: ':id',
    title: 'Ficha del colaborador',
    loadComponent: () => import('./pages/employee-detail-page/employee-detail-page').then((m) => m.EmployeeDetailPage),
  },
];
