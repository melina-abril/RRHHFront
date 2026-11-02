import { AppRole, NavigationItem } from './core/layout/navigation.model';

export const APP_TITLE = 'Gestión de RR.HH';

export const APP_ROLES: AppRole[] = [];

export const APP_NAVIGATION: NavigationItem[] = [
  { path: 'dashboard', label: 'Inicio' },
  { path: 'employees', label: 'Gestión de Empleados' }
];
