import { Observable } from 'rxjs';
import { mockResponse } from '../../../core/http/mock-response';
import { DashboardSummaryResponse } from '../models/dashboard.models';

export function getDashboardSummaryMock(): Observable<DashboardSummaryResponse> {
  return mockResponse({
    activeEmployees: 3,
    pendingRequests: 0,
    upcomingEvents: 0,
  });
}
