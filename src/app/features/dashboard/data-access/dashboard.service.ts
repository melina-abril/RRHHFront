import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { DashboardSummaryResponse } from '../models/dashboard.models';
import { getDashboardSummaryMock } from './dashboard.mock';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDashboardSummary(): Observable<DashboardSummaryResponse> {
    if (environment.useMock) return getDashboardSummaryMock();
    return this.http.get<DashboardSummaryResponse>(apiUrl('/api/dashboard/summary'));
  }
}
