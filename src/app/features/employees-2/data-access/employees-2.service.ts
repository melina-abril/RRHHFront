import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { EmployeeFilters, EmployeeResponse, UpdateEmployeeRequest } from '../models/employees-2.models';
import { getEmployeeMock, listEmployeesMock, updateEmployeeMock } from './employees-2.mock';

@Injectable({ providedIn: 'root' })
export class Employees2Service {
  private readonly http = inject(HttpClient);

  listEmployees(filters: EmployeeFilters): Observable<Page<EmployeeResponse>> {
    if (environment.useMock) return listEmployeesMock(filters);
    let params = new HttpParams().set('page', filters.page).set('size', filters.size);
    if (filters.search.trim()) params = params.set('search', filters.search.trim());
    if (filters.category) params = params.set('category', filters.category);
    if (filters.client.trim()) params = params.set('client', filters.client.trim());
    if (filters.project.trim()) params = params.set('project', filters.project.trim());
    if (filters.status) params = params.set('status', filters.status);
    return this.http.get<Page<EmployeeResponse>>(apiUrl('/api/employees'), { params });
  }

  getEmployee(id: string): Observable<EmployeeResponse> {
    if (environment.useMock) return getEmployeeMock(id);
    return this.http.get<EmployeeResponse>(apiUrl(`/api/employees/${encodeURIComponent(id)}`));
  }

  updateEmployee(id: string, request: UpdateEmployeeRequest): Observable<EmployeeResponse> {
    if (environment.useMock) return updateEmployeeMock(id, request);
    return this.http.put<EmployeeResponse>(apiUrl(`/api/employees/${encodeURIComponent(id)}`), request);
  }
}
