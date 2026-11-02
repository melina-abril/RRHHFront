import { AppRole, NavigationItem } from './core/layout/navigation.model';

export const APP_TITLE = 'Gestión de RR.HH';

// El contrato disponible no declara códigos de rol para estas rutas.
export const APP_ROLES: readonly AppRole[] = [];

export const APP_NAVIGATION: readonly NavigationItem[] = [
  { path: 'employee-editing', label: 'Edición de colaborador' },
  { path: 'employment-movements', label: 'Movimientos laborales' },
  { path: 'project-assignments', label: 'Clientes, proyectos y asignaciones' },
  { path: 'professional-profiles', label: 'Perfil profesional y documentación' },
];
