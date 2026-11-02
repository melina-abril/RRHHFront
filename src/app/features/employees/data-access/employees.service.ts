import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { Employee, EmployeeFilters, EmployeeRequest } from '../models/employees.models';
import {
  createEmployeeMock,
  getEmployeeMock,
  listEmployeesMock,
  rejoinEmployeeMock,
  terminateEmployeeMock,
  updateEmployeeMock
} from './employees.mock';

/**
 * Un método por servicio del backend: mock si environment.useMock, HTTP a apiUrl si no.
 */
@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly http = inject(HttpClient);

  /** GET /employees?search=&status=&departmentId=&positionId=&page=&size= */
  list(filters: EmployeeFilters): Observable<Page<Employee>> {
    if (environment.useMock) return listEmployeesMock(filters);
    let params = new HttpParams()
      .set('page', filters.page)
      .set('size', filters.size);
    if (filters.search.trim()) params = params.set('search', filters.search.trim());
    if (filters.status) params = params.set('status', filters.status);
    if (filters.departmentId) params = params.set('departmentId', filters.departmentId);
    if (filters.positionId) params = params.set('positionId', filters.positionId);
    return this.http.get<Page<Employee>>(apiUrl('/employees'), { params });
  }

  /** GET /employees/:id */
  get(id: string): Observable<Employee> {
    if (environment.useMock) return getEmployeeMock(id);
    return this.http.get<Employee>(apiUrl(`/employees/${encodeURIComponent(id)}`));
  }

  /** POST /employees */
  create(request: EmployeeRequest): Observable<Employee> {
    if (environment.useMock) return createEmployeeMock(request);
    return this.http.post<Employee>(apiUrl('/employees'), request);
  }

  /** PUT /employees/:id */
  update(id: string, request: EmployeeRequest): Observable<Employee> {
    if (environment.useMock) return updateEmployeeMock(id, request);
    return this.http.put<Employee>(apiUrl(`/employees/${encodeURIComponent(id)}`), request);
  }

  /** POST /employees/:id/terminate */
  terminate(id: string): Observable<void> {
    if (environment.useMock) return terminateEmployeeMock(id);
    return this.http.post<void>(apiUrl(`/employees/${encodeURIComponent(id)}/terminate`), {});
  }

  /** POST /employees/:id/rejoin (body: { hireDate }) */
  rejoin(id: string, hireDate: string): Observable<Employee> {
    if (environment.useMock) return rejoinEmployeeMock(id, hireDate);
    return this.http.post<Employee>(apiUrl(`/employees/${encodeURIComponent(id)}/rejoin`), { hireDate });
  }
}
