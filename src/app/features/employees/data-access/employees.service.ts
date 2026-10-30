import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { Employee, EmployeeFilters, CreateEmployeeRequest, UpdateEmployeeRequest } from '../models/employees.models';
import {
  createEmployeeMock,
  getEmployeeMock,
  listEmployeesMock,
  updateEmployeeMock,
  leaveEmployeeMock,
  rejoinEmployeeMock
} from './employees.mock';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly http = inject(HttpClient);

  /** GET /api/employees */
  list(filters: EmployeeFilters): Observable<Page<Employee>> {
    if (environment.useMock) return listEmployeesMock(filters);
    let params = new HttpParams()
      .set('search', filters.search)
      .set('legajo', filters.legajo)
      .set('page', filters.page)
      .set('size', filters.size);
    if (filters.category) params = params.set('category', filters.category);
    if (filters.client) params = params.set('client', filters.client);
    if (filters.project) params = params.set('project', filters.project);
    if (filters.state) params = params.set('state', filters.state);
    return this.http.get<Page<Employee>>(apiUrl('/api/employees'), { params });
  }

  /** GET /api/employees/{id} */
  get(id: string): Observable<Employee> {
    if (environment.useMock) return getEmployeeMock(id);
    return this.http.get<Employee>(apiUrl(`/api/employees/${encodeURIComponent(id)}`));
  }

  /** POST /api/employees */
  create(request: CreateEmployeeRequest): Observable<Employee> {
    if (environment.useMock) return createEmployeeMock(request);
    return this.http.post<Employee>(apiUrl('/api/employees'), request);
  }

  /** PUT /api/employees/{id} */
  update(id: string, request: UpdateEmployeeRequest): Observable<Employee> {
    if (environment.useMock) return updateEmployeeMock(id, request);
    return this.http.put<Employee>(apiUrl(`/api/employees/${encodeURIComponent(id)}`), request);
  }

  /** POST /api/employees/{id}/leave */
  leave(id: string): Observable<void> {
    if (environment.useMock) return leaveEmployeeMock(id);
    return this.http.post<void>(apiUrl(`/api/employees/${encodeURIComponent(id)}/leave`), {});
  }

  /** POST /api/employees/{id}/rejoin */
  rejoin(id: string): Observable<Employee> {
    if (environment.useMock) return rejoinEmployeeMock(id);
    return this.http.post<Employee>(apiUrl(`/api/employees/${encodeURIComponent(id)}/rejoin`), {});
  }
}
