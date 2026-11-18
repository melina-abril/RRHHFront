import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home-page').then(m => m.HomePage),
  },
  { path: '**', redirectTo: '' },
];
