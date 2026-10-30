import { Routes } from '@angular/router';
import { InicioPage } from './pages/inicio-page/inicio-page';

export const INICIO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/inicio-page/inicio-page').then(m => m.InicioPage)
  }
];
