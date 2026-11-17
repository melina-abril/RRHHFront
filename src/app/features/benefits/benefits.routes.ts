import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const BENEFITS_ROUTES: Routes = [
  {
    path: '',
    title: 'Beneficios y saldos',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/benefits-page/benefits-page').then((m) => m.BenefitsPage),
  },
  {
    path: ':id',
    title: 'Beneficios y saldos',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/benefits-page/benefits-page').then((m) => m.BenefitsPage),
  },
];
