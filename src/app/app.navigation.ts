import type { AppRole, NavigationItem } from './core/layout/navigation.model';

export const APP_TITLE: string = 'Gestión de RR.HH';

export const APP_ROLES: readonly AppRole[] = [
  { value: 'ADMIN', label: 'Administración de Recursos Humanos', userName: 'Administración de RR.HH' }
];

export const APP_NAVIGATION: readonly NavigationItem[] = [
  { path: '/dashboard', label: 'Pantalla principal', roles: ['ADMIN'] },
  { path: '/employees', label: 'Gestión de empleados', roles: ['ADMIN'] }
];
