import { AppRole, NavigationItem } from './core/layout/navigation.model';

/** Título visible del sistema en el encabezado y la pestaña. */
export const APP_TITLE = 'Gestión de RR.HH.';

/** Roles del sistema: mismos códigos que el backend (SessionUser.role); el primero es el usuario de la demo. */
export const APP_ROLES: AppRole[] = [
  {
    value: 'ADMIN_RRHH',
    label: 'Administración de RR.HH.',
    userName: 'Administrador RH',
  }
];

/** Navegación por módulos: un link por funcionalidad. */
export const APP_NAVIGATION: NavigationItem[] = [
  { path: 'main-dashboard', label: 'Inicio', roles: ['ADMIN_RRHH'] },
  { path: 'employees', label: 'Empleados', roles: ['ADMIN_RRHH'] }
];
