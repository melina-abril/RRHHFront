import { Routes } from '@angular/router';
import { EmployeeListPage } from './pages/employee-list-page/employee-list-page';

export const EMPLOYEE_LIST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/employee-list-page/employee-list-page').then(m => m.EmployeeListPage)
  }
];
