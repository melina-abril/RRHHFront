import { Observable } from 'rxjs';
import { mockResponse } from '../../../core/http/mock-response';
import { DashboardSummaryResponse } from '../models/dashboard.models';

/** Datos de demostración con la misma forma que la respuesta del backend. */
export function getDashboardSummaryMock(): Observable<DashboardSummaryResponse> {
  const nextMonth = new Date();
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1, 12);
  const summary: DashboardSummaryResponse = {
    activeEmployees: 3,
    pendingRequests: null,
    pendingRequestsMessage: 'Las solicitudes pendientes todavía no están disponibles.',
    upcomingEvents: [
      {
        type: 'BIRTHDAY',
        employeeId: 'demo-employee-001',
        employeeNumber: 'EMP-001',
        employeeName: 'Lucía Fernández',
        date: nextMonth.toISOString().slice(0, 10),
      },
    ],
  };
  return mockResponse(summary);
}
