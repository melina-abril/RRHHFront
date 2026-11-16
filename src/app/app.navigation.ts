import type { AppRole, NavigationItem } from './core/layout/navigation.model';

export const APP_TITLE = 'Gestión de RR.HH';

export const APP_ROLES: readonly AppRole[] = [
  {
    value: 'ADMIN',
    label: 'Administración de Recursos Humanos',
    userName: 'Administración de Recursos Humanos',
  },
];

export const APP_NAVIGATION: readonly NavigationItem[] = [
  {
    path: '/employees',
    label: 'Colaboradores',
    roles: ['ADMIN'],
  },
  {
    path: '/dashboard',
    label: 'Pantalla principal',
    roles: ['ADMIN'],
  },
];
