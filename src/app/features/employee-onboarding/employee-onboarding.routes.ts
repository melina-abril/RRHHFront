import { Routes } from '@angular/router';

export const EMPLOYEE_ONBOARDING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/employee-onboarding-page/employee-onboarding-page').then(m => m.EmployeeOnboardingPage)
  }
];
