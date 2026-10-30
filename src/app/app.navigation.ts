import { AppRole, NavigationItem } from './core/layout/navigation.model';

export const APP_TITLE = 'Gestión de RR.HH.';

export const APP_ROLES: AppRole[] = [
  {
    value: 'ADMIN_RRHH',
    label: 'Administrador RR.HH.',
    userName: 'Recursos Humanos'
  }
];

export const APP_NAVIGATION: NavigationItem[] = [
  {
    path: 'main-dashboard',
    label: 'Principal'
  },
  {
    path: 'employees',
    label: 'Gestión de empleados'
  }
];
