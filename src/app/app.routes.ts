import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'employee-editing' },
  {
    path: 'employee-editing',
    loadChildren: () => import('./features/employee-editing/employee-editing.routes').then((m) => m.EMPLOYEE_EDITING_ROUTES),
  },
  {
    path: 'employment-movements',
    loadChildren: () => import('./features/employment-movements/employment-movements.routes').then((m) => m.EMPLOYMENT_MOVEMENTS_ROUTES),
  },
  {
    path: 'project-assignments',
    loadChildren: () => import('./features/project-assignments/project-assignments.routes').then((m) => m.PROJECT_ASSIGNMENTS_ROUTES),
  },
  {
    path: 'professional-profiles',
    loadChildren: () => import('./features/professional-profiles/professional-profiles.routes').then((m) => m.PROFESSIONAL_PROFILES_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
