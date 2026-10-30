import { Routes } from '@angular/router';

export const EMPLOYEE_PROFILE_ROUTES: Routes = [
  {
    path: ':legajo',
    loadComponent: () => import('./pages/employee-profile-page/employee-profile-page').then(m => m.EmployeeProfilePage)
  }
];
