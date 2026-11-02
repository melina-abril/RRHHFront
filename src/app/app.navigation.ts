import { AppRole, NavigationItem } from './core/layout/navigation.model';

// Título del sistema en la pestaña y el encabezado
export const APP_TITLE = 'Gestión de RR.HH';

/**
 * Roles del sistema: la demo solo tiene el rol de administrador de Recursos Humanos, ya que solo existe una cuenta para esa área.
 * El campo value debe coincidir exactamente con el users.role del backend y los requerimientos/restricciones del backend.
 */
export const APP_ROLES: AppRole[] = [
  {
    value: 'ADMIN_RRHH',
    label: 'Administrador de RR.HH',
    userName: 'María Recursos',
  }
];

/**
 * Navegación: un link por módulo con su path, nombre y los roles que pueden verlo/acceder.
 * Con un solo rol, todos los módulos son accesibles por ese rol y no requieren restricción adicional.
 */
export const APP_NAVIGATION: NavigationItem[] = [
  {
    path: 'dashboard',
    label: 'Inicio'
  },
  {
    path: 'employees',
    label: 'Empleados'
  }
];
