import { Routes } from '@angular/router';

export const COLABORADORES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/colaboradores-list-page/colaboradores-list-page').then(m => m.ColaboradoresListPage)
  },
  {
    path: 'nuevo',
    loadComponent: () => import('./pages/colaborador-form-page/colaborador-form-page').then(m => m.ColaboradorFormPage)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/colaborador-detail-page/colaborador-detail-page').then(m => m.ColaboradorDetailPage)
  },
  {
    path: ':id/editar',
    loadComponent: () => import('./pages/colaborador-form-page/colaborador-form-page').then(m => m.ColaboradorFormPage)
  }
];
