import { Observable } from 'rxjs';
import { mockResponse } from '../../../core/http/mock-response';
import { DashboardResponse } from '../models/main-dashboard.models';

/**
 * Datos MOCK de dashboard: los textos y módulos visibles deben coincidir
 * exactamente con el contrato y las historias.
 */
let dashboard: DashboardResponse = {
  activeEmployees: 0,
  pendingRequests: 0,
  upcomingEvents: 0,
  welcomeMessage: 'Bienvenido al sistema de Recursos Humanos de TECHFORB. Consultá la actividad general y accedé a los módulos desde un solo lugar.',
  quickAccessesMessage: 'Ingresá directamente al módulo que necesitás.',
  modules: [
    { title: 'Gestión de Empleados', description: 'Legajos, perfiles y asignaciones', moduleKey: 'employees' },
    { title: 'Sueldos y Bonos', description: 'Remuneraciones y beneficios', moduleKey: 'payroll' },
    { title: 'Solicitudes', description: 'Revisión y seguimiento de pedidos', moduleKey: 'requests' },
    { title: 'Comunicados', description: 'Mensajes y registro de envíos', moduleKey: 'notices' },
    { title: 'Horas Extras', description: 'Autorizaciones y compensaciones', moduleKey: 'extra-hours' }
  ]
};

export function getDashboardIndicatorsMock(): Observable<DashboardResponse> {
  return mockResponse(structuredClone(dashboard));
}
