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

  /** GET /api/dashboard/summary: apiUrl agrega el prefijo configurado en el entorno. */
  getDashboardSummary(): Observable<DashboardSummaryResponse> {
    if (environment.useMock) return getDashboardSummaryMock();
    return this.http.get<DashboardSummaryResponse>(apiUrl('/dashboard/summary'));
  }
}
