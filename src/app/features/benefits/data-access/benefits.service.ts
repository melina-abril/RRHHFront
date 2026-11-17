import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { BenefitAdjustmentRequest, BenefitBalanceResponse, BenefitBalancesResponse, BenefitMovementResponse } from '../models/benefits.models';
import { createBenefitAdjustmentMock, getBenefitBalancesMock, listBenefitMovementsMock } from './benefits.mock';

@Injectable({ providedIn: 'root' })
export class BenefitsService {
  private readonly http = inject(HttpClient);

  getBenefitBalances(id: string): Observable<BenefitBalancesResponse> {
    if (environment.useMock) return getBenefitBalancesMock(id);
    return this.http.get<BenefitBalancesResponse>(apiUrl(`/api/benefits/${encodeURIComponent(id)}`));
  }

  listBenefitMovements(id: string): Observable<BenefitMovementResponse[]> {
    if (environment.useMock) return listBenefitMovementsMock(id);
    return this.http.get<BenefitMovementResponse[]>(apiUrl(`/api/benefits/${encodeURIComponent(id)}/movements`));
  }

  createBenefitAdjustment(id: string, request: BenefitAdjustmentRequest): Observable<BenefitMovementResponse> {
    if (environment.useMock) return createBenefitAdjustmentMock(id, request);
    return this.http.post<BenefitMovementResponse>(apiUrl(`/api/benefits/${encodeURIComponent(id)}/adjustments`), request);
  }
}
