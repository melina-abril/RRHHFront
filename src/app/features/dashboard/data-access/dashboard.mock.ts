import { Observable } from 'rxjs';
import { mockResponse } from '../../../core/http/mock-response';
import { DashboardSummaryResponse } from '../models/dashboard.models';

/** Respuesta de demostración con la misma forma que GET /api/dashboard/summary. */
export function getDashboardSummaryMock(): Observable<DashboardSummaryResponse> {
  return mockResponse({
    activeEmployees: 3,
    pendingRequests: null,
    pendingRequestsMessage: 'Las solicitudes todavía no están disponibles en este panel.',
    upcomingEvents: [
      {
        type: 'BIRTHDAY',
        employeeId: 'EMP-001',
        employeeNumber: '001',
        employeeName: 'Lucía Fernández',
        date: '2026-12-08',
      },
      {
        type: 'BIRTHDAY',
        employeeId: 'EMP-002',
        employeeNumber: '002',
        employeeName: 'Paula Medina',
        date: '2026-12-12',
      },
    ],
  });
}
