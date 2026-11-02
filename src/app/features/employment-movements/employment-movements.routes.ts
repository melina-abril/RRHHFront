import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const EMPLOYMENT_MOVEMENTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Movimientos laborales',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/employment-movements-page/employment-movements-page').then((m) => m.EmploymentMovementsPage),
  },
];
