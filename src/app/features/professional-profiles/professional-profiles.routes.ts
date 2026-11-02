import { Routes } from '@angular/router';

export const PROFESSIONAL_PROFILES_ROUTES: Routes = [
  {
    path: '',
    title: 'Perfil técnico y documentación',
    loadComponent: () => import('./pages/professional-profile-page/professional-profile-page').then((m) => m.ProfessionalProfilePage),
  },
  {
    path: ':employeeId',
    title: 'Perfil técnico y documentación',
    loadComponent: () => import('./pages/professional-profile-page/professional-profile-page').then((m) => m.ProfessionalProfilePage),
  },
];
