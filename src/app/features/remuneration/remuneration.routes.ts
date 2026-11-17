import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const REMUNERATION_ROUTES: Routes = [
  {
    path: '',
    title: 'Remuneraciones',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/remuneration-page/remuneration-page').then((m) => m.RemunerationPage),
  },
  {
    path: ':id',
    title: 'Remuneración e historial salarial',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/remuneration-page/remuneration-page').then((m) => m.RemunerationPage),
  },
];
