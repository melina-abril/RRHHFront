import { Routes } from '@angular/router';
import { WorkMovementsPage } from './pages/work-movements-page/work-movements-page';

export const WORK_MOVEMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/work-movements-page/work-movements-page').then(m => m.WorkMovementsPage)
  }
];
