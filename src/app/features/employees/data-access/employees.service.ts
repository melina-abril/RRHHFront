import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { Employee, EmployeeCreateRequest, EmployeeFilters, EmployeeUpdateRequest } from '../models/employees.models';
import { createEmployeeMock, getEmployeeMock, listEmployeesMock, updateEmployeeMock } from './employees.mock';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly http = inject(HttpClient);

  list(filters: EmployeeFilters): Observable<Page<Employee>> {
    if (environment.useMock) return listEmployeesMock(filters);
    let params = new HttpParams().set('page', filters.page).set('size', filters.size);
    if (filters.search.trim()) params = params.set('search', filters.search.trim());
    if (filters.category) params = params.set('category', filters.category);
    if (filters.client.trim()) params = params.set('client', filters.client.trim());
    if (filters.project.trim()) params = params.set('project', filters.project.trim());
    if (filters.status) params = params.set('status', filters.status);
    return this.http.get<Page<Employee>>(apiUrl('/api/employees'), { params });
  }

  get(id: string): Observable<Employee> {
    if (environment.useMock) return getEmployeeMock(id);
    return this.http.get<Employee>(apiUrl(`/api/employees/${encodeURIComponent(id)}`));
  }

  create(request: EmployeeCreateRequest): Observable<Employee> {
    if (environment.useMock) return createEmployeeMock(request);
    return this.http.post<Employee>(apiUrl('/api/employees'), request);
  }

  update(id: string, request: EmployeeUpdateRequest): Observable<Employee> {
    if (environment.useMock) return updateEmployeeMock(id, request);
    return this.http.put<Employee>(apiUrl(`/api/employees/${encodeURIComponent(id)}`), request);
  }
}
