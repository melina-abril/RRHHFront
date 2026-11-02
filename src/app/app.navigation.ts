import { AppRole, NavigationItem } from './core/layout/navigation.model';

export const APP_TITLE = 'Gestión de RR.HH';

/** El contrato disponible no especifica códigos de roles para estas rutas. */
export const APP_ROLES: readonly AppRole[] = [];

export const APP_NAVIGATION: readonly NavigationItem[] = [
  { path: 'dashboard', label: 'Pantalla principal' },
  { path: 'employees', label: 'Gestión de empleados' },
];
