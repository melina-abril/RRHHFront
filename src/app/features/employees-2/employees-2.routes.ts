import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const EMPLOYEES_2_ROUTES: Routes = [
  {
    path: '',
    title: 'Gestión de Empleados',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employees-list-page/employees-list-page').then((m) => m.EmployeesListPage),
  },
  {
    path: ':id/edit',
    title: 'Editar colaborador',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employee-edit-page/employee-edit-page').then((m) => m.EmployeeEditPage),
  },
];
