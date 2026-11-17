import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const PROFESSIONAL_PROFILE_ROUTES: Routes = [
  {
    path: '',
    title: 'Perfil profesional y documentación',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/professional-profile-page/professional-profile-page').then((m) => m.ProfessionalProfilePage),
  },
  {
    path: ':id',
    title: 'Perfil profesional y documentación',
    canMatch: [roleGuard('ADMIN')],
    loadComponent: () => import('./pages/professional-profile-page/professional-profile-page').then((m) => m.ProfessionalProfilePage),
  },
];
