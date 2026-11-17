import type { Routes } from '@angular/router';
import { roleGuard } from './core/session/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'employees',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES)
  },
  {
    path: 'employment-movements',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/employment-movements/employment-movements.routes').then(m => m.EMPLOYMENT_MOVEMENTS_ROUTES)
  },
  {
    path: 'professional-profiles',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/professional-profile/professional-profile.routes').then(m => m.PROFESSIONAL_PROFILE_ROUTES)
  },
  {
    path: 'benefits',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/benefits/benefits.routes').then(m => m.BENEFITS_ROUTES)
  },
  {
    path: 'remunerations',
    canMatch: [roleGuard('ADMIN')],
    loadChildren: () => import('./features/remuneration/remuneration.routes').then(m => m.REMUNERATION_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
