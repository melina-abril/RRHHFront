import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { apiUrl } from 'src/app/core/http/api-url';
import { mockResponse } from 'src/app/core/http/mock-response';
import {
  WorkMovement,
  ChangeCategoryRequest,
  EgressRequest,
  ReentryRequest,
} from '../models/work-movements.models';
import { workMovementsHistoryMock } from './work-movements.mock';
import { Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WorkMovementsService {
  private readonly http = inject(HttpClient);

  getWorkMovementsHistory(legajo: string): Observable<WorkMovement[]> {
    if (environment.useMock) {
      // MOCK: lista de movimientos laborales de ejemplo para el colaborador legajo
      return mockResponse(workMovementsHistoryMock.filter(m => m.legajo === legajo));
    }
    return this.http.get<WorkMovement[]>(apiUrl(`/api/work-movements/${encodeURIComponent(legajo)}/history`));
  }

  changeCategory(legajo: string, req: ChangeCategoryRequest): Observable<WorkMovement> {
    if (environment.useMock) {
      // MOCK: devuelve un movimiento de cambio de categoría ejemplo
      return mockResponse({
        legajo,
        type: 'CHANGE_CATEGORY',
        date: req.effectiveDate,
        previousCategory: 'Pasante',
        newCategory: req.newCategory,
        previousStatus: 'ACTIVE',
        newStatus: 'ACTIVE',
        reason: req.reason,
        performedBy: 'Administrador RR.HH',
        createdAt: new Date().toISOString()
      });
    }
    return this.http.post<WorkMovement>(apiUrl(`/api/work-movements/${encodeURIComponent(legajo)}/change-category`), req);
  }

  registerEgress(legajo: string, req: EgressRequest): Observable<WorkMovement> {
    if (environment.useMock) {
      // MOCK: devuelve un movimiento de egreso ejemplo
      return mockResponse({
        legajo,
        type: 'EGRESS',
        date: req.effectiveDate,
        previousCategory: 'Permanente',
        newCategory: 'Permanente',
        previousStatus: 'ACTIVE',
        newStatus: 'INACTIVE',
        reason: req.reason,
        performedBy: 'Administrador RR.HH',
        createdAt: new Date().toISOString()
      });
    }
    return this.http.post<WorkMovement>(apiUrl(`/api/work-movements/${encodeURIComponent(legajo)}/egress`), req);
  }

  registerReentry(legajo: string, req: ReentryRequest): Observable<WorkMovement> {
    if (environment.useMock) {
      // MOCK: devuelve un movimiento de reingreso ejemplo
      return mockResponse({
        legajo,
        type: 'REENTRY',
        date: req.reentryDate,
        previousCategory: 'Permanente',
        newCategory: req.newCategory,
        previousStatus: 'INACTIVE',
        newStatus: 'ACTIVE',
        reason: req.reason,
        performedBy: 'Administrador RR.HH',
        createdAt: new Date().toISOString()
      });
    }
    return this.http.post<WorkMovement>(apiUrl(`/api/work-movements/${encodeURIComponent(legajo)}/reentry`), req);
  }
}
