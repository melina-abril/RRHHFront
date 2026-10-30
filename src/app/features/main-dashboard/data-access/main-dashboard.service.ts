import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { DashboardResponse } from '../models/main-dashboard.models';
import { getDashboardIndicatorsMock } from './main-dashboard.mock';

/**
 * Datos principales de la pantalla de inicio. Devuelve mocks si environment.useMock, si no llama al backend con el contrato.
 */
@Injectable({ providedIn: 'root' })
export class MainDashboardService {
  private readonly http = inject(HttpClient);

  /**
   * GET /api/dashboard
   */
  getDashboardIndicators(): Observable<DashboardResponse> {
    if (environment.useMock) return getDashboardIndicatorsMock();
    return this.http.get<DashboardResponse>(apiUrl('/dashboard'));
  }
}
