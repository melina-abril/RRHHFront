import { Routes } from '@angular/router';

export const EMPLOYEE_EDITING_ROUTES: Routes = [
  {
    path: '',
    title: 'Editar información del colaborador',
    loadComponent: () => import('./pages/employee-editing-page/employee-editing-page').then((m) => m.EmployeeEditingPage),
  },
];
