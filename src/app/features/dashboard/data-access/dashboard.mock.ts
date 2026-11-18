import { Observable } from 'rxjs';
import { mockResponse } from '../../../core/http/mock-response';
import { DashboardResponse } from '../models/dashboard.models';

export function getDashboardMock(): Observable<DashboardResponse> {
  return mockResponse({ activeEmployees: 3 });
}
