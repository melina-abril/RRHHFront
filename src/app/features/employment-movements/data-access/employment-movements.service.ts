import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import {
  CategoryChangeRequest,
  DepartureRequest,
  EmploymentMovementsResponse,
  RehireRequest,
} from '../models/employment-movements.models';
import {
  changeCategoryMock,
  getEmploymentMovementsMock,
  registerDepartureMock,
  registerRehireMock,
} from './employment-movements.mock';

@Injectable({ providedIn: 'root' })
export class EmploymentMovementsService {
  private readonly http = inject(HttpClient);

  // apiBaseUrl ya contiene /api; no se vuelve a añadir ese prefijo.
  getEmploymentMovements(id: string): Observable<EmploymentMovementsResponse> {
    if (environment.useMock) return getEmploymentMovementsMock(id);
    return this.http.get<EmploymentMovementsResponse>(apiUrl(`/employment-movements/${encodeURIComponent(id)}`));
  }

  changeCategory(id: string, request: CategoryChangeRequest): Observable<EmploymentMovementsResponse> {
    if (environment.useMock) return changeCategoryMock(id, request);
    return this.http.post<EmploymentMovementsResponse>(apiUrl(`/employment-movements/${encodeURIComponent(id)}/category-change`), request);
  }

  registerDeparture(id: string, request: DepartureRequest): Observable<EmploymentMovementsResponse> {
    if (environment.useMock) return registerDepartureMock(id, request);
    return this.http.post<EmploymentMovementsResponse>(apiUrl(`/employment-movements/${encodeURIComponent(id)}/departure`), request);
  }

  registerRehire(id: string, request: RehireRequest): Observable<EmploymentMovementsResponse> {
    if (environment.useMock) return registerRehireMock(id, request);
    return this.http.post<EmploymentMovementsResponse>(apiUrl(`/employment-movements/${encodeURIComponent(id)}/rehire`), request);
  }
}
