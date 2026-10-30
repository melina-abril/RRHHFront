import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { apiUrl } from 'src/app/core/http/api-url';
import { mockResponse } from 'src/app/core/http/mock-response';
import { EmployeeListFilterRequest, EmployeeListPageResponse } from '../models/employee-list.models';
import { EMPLOYEE_LIST_MOCK } from './employee-list.mock';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeListService {
  readonly filters = signal<EmployeeListFilterRequest>({
    search: '',
    categoria: '',
    cliente: '',
    proyecto: '',
    estado: '',
    page: 0,
    size: 20
  });

  // Llama al backend o usa mock según el entorno
  getEmployeeList(filters: EmployeeListFilterRequest): Observable<EmployeeListPageResponse> {
    if (environment.useMock) {
      // MOCK: datos fijos y realistas
      // Sólo se filtrarán los resultados en el backend real
      return mockResponse(EMPLOYEE_LIST_MOCK);
    }
    return this.http.get<EmployeeListPageResponse>(apiUrl('/api/employee-list'), {
      params: {
        search: filters.search || '',
        categoria: filters.categoria || '',
        cliente: filters.cliente || '',
        proyecto: filters.proyecto || '',
        estado: filters.estado || '',
        page: filters.page?.toString() ?? '0',
        size: filters.size?.toString() ?? '20',
        sort: filters.sort || 'lastName,firstName'
      }
    });
  }

  constructor(private http: HttpClient) {}
}
