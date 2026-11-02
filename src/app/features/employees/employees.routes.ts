import { Routes } from '@angular/router';
import { EmployeesPage } from './pages/employees-page/employees-page';
import { EmployeeDetailPage } from './pages/employee-detail-page/employee-detail-page';
import { EmployeeFormPage } from './pages/employee-form-page/employee-form-page';

/**
 * Rutas del módulo Gestión de Empleados: listado, alta, detalle y edición. Requiere 'ADMIN_RRHH'.
 */
export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/employees-page/employees-page').then(m => m.EmployeesPage),
    title: 'Colaboradores'
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/employee-form-page/employee-form-page').then(m => m.EmployeeFormPage),
    title: 'Alta de colaborador'
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/employee-detail-page/employee-detail-page').then(m => m.EmployeeDetailPage),
    title: 'Ficha del colaborador'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/employee-form-page/employee-form-page').then(m => m.EmployeeFormPage),
    title: 'Editar colaborador'
  }
];
