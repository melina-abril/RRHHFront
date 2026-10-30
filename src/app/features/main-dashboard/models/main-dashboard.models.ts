import { LoadState } from '../../../shared/models/load-state';

/**
 * Interfaces iguales a los DTOs del backend (DashboardResponse del contrato Java).
 * Todos los nombres y valores, incluidos los textos, se mantienen exactamente iguales.
 */
export interface DashboardResponse {
  activeEmployees: number;
  pendingRequests: number;
  upcomingEvents: number;
  welcomeMessage: string;
  quickAccessesMessage: string;
  modules: ModuleShortcut[];
}

export interface ModuleShortcut {
  title: string;
  description: string;
  moduleKey: string;
}

/** Estados/etiquetas orientativas para el panel. */
export const DASHBOARD_INDICATOR_LABELS: Record<string, string> = {
  activeEmployees: 'Colaboradores activos',
  pendingRequests: 'Solicitudes pendientes',
  upcomingEvents: 'Próximos eventos',
};

/** Mensajes informativos para Dashboard en vacío o sin datos. */
export const DASHBOARD_EMPTY_LABELS = {
  activeEmployees: 'Sin colaboradores activos registrados',
  pendingRequests: 'Sin solicitudes para revisar',
  upcomingEvents: 'Cumpleaños y beneficios por vencer',
};
