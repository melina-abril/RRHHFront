import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { DashboardResponse } from '../models/dashboard.models';
import { getDashboardMock } from './dashboard.mock';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<DashboardResponse> {
    if (environment.useMock) return getDashboardMock();
    return this.http.get<DashboardResponse>(apiUrl('/api/dashboard'));
  }
}
