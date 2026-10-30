import { Routes } from '@angular/router';
export const EMPLOYEE_EDITION_ROUTES: Routes = [
  {
    path: ':id/editar',
    loadComponent: () => import('./pages/employee-edit-page/employee-edit-page').then(m => m.EmployeeEditPage)
  }
];
