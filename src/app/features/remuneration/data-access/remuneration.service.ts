import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { RemunerationHistoryResponse, RemunerationPeriodResponse, RemunerationRequest } from '../models/remuneration.models';
import { createRemunerationPeriodMock, listRemunerationPeriodsMock } from './remuneration.mock';

@Injectable({ providedIn: 'root' })
export class RemunerationService {
  private readonly http = inject(HttpClient);

  listRemunerationPeriods(id: string): Observable<RemunerationHistoryResponse> {
    if (environment.useMock) return listRemunerationPeriodsMock(id);
    return this.http.get<RemunerationHistoryResponse>(apiUrl(`/api/remunerations/${encodeURIComponent(id)}`));
  }

  createRemunerationPeriod(id: string, request: RemunerationRequest): Observable<RemunerationPeriodResponse> {
    if (environment.useMock) return createRemunerationPeriodMock(id, request);
    return this.http.post<RemunerationPeriodResponse>(apiUrl(`/api/remunerations/${encodeURIComponent(id)}`), request);
  }
}
