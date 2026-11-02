import { AppRole, NavigationItem } from './core/layout/navigation.model';

/** Título del sistema: se muestra en el encabezado y la pestaña. */
export const APP_TITLE = 'Gestión de RR.HH';

/** Roles del sistema (códigos exactos del backend; en este MVP solo el admin de RR.HH.). */
export const APP_ROLES: AppRole[] = [
  {
    value: 'ADMIN_RRHH',
    label: 'Administrador RR.HH.',
    userName: 'Recursos Humanos',
  }
];

/** Navegación: un link por módulo. Los colaboradores no tienen acceso al panel, solo el admin RR.HH. En la demo siempre se ve el panel. */
export const APP_NAVIGATION: NavigationItem[] = [
  {
    path: 'dashboard',
    label: 'Inicio',
    roles: ['ADMIN_RRHH']
  },
  {
    path: 'employees',
    label: 'Gestión de Empleados',
    roles: ['ADMIN_RRHH']
  }
];
