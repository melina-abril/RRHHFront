import type { AppRole, NavigationItem } from './core/layout/navigation.model';

export const APP_TITLE = 'Gestión de RR.HH';

export const APP_ROLES: readonly AppRole[] = [
  { value: 'ADMIN', label: 'Administración de Recursos Humanos', userName: 'Administración de RR. HH.' }
];

export const APP_NAVIGATION: readonly NavigationItem[] = [
  { path: '/dashboard', label: 'Pantalla principal', roles: ['ADMIN'] },
  { path: '/employees', label: 'Colaboradores', roles: ['ADMIN'] },
  { path: '/employment-movements', label: 'Movimientos laborales', roles: ['ADMIN'] },
  { path: '/professional-profiles', label: 'Perfil profesional y documentación', roles: ['ADMIN'] },
  { path: '/benefits', label: 'Beneficios y saldos', roles: ['ADMIN'] },
  { path: '/remunerations', label: 'Remuneraciones e historial salarial', roles: ['ADMIN'] }
];
