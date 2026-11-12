import { Observable } from 'rxjs';
import { mockResponse } from '../../../core/http/mock-response';
import { DashboardSummaryResponse } from '../models/dashboard.models';

/** Sin registros de demostración asociados, los indicadores comienzan en cero. */
export function getDashboardSummaryMock(): Observable<DashboardSummaryResponse> {
  return mockResponse({ activeEmployees: 0, pendingRequests: 0, upcomingEvents: 0 });
}
