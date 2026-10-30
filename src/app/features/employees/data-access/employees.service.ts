import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { EmployeeDetails, EmployeeFilters, EmployeeList, CreateEmployeeRequest } from '../models/employees.models';
import { createEmployeeMock, getEmployeeDetailsMock, listEmployeesMock } from './employees.mock';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly http = inject(HttpClient);

  /** GET /api/employees?search=&legajo=&category=&client=&project=&status=&page=&size= */
  list(filters: EmployeeFilters): Observable<Page<EmployeeList>> {
    if (environment.useMock) return listEmployeesMock(filters);
    let params = new HttpParams()
      .set('page', filters.page)
      .set('size', filters.size);
    if (filters.search.trim()) params = params.set('search', filters.search.trim());
    if (filters.legajo.trim()) params = params.set('legajo', filters.legajo.trim());
    if (filters.category) params = params.set('category', filters.category);
    if (filters.client.trim()) params = params.set('client', filters.client.trim());
    if (filters.project.trim()) params = params.set('project', filters.project.trim());
    if (filters.status) params = params.set('status', filters.status);
    return this.http.get<Page<EmployeeList>>(apiUrl('/employees'), { params });
  }

  /** GET /api/employees/{id} */
  get(id: string): Observable<EmployeeDetails> {
    if (environment.useMock) return getEmployeeDetailsMock(id);
    return this.http.get<EmployeeDetails>(apiUrl(`/employees/${encodeURIComponent(id)}`));
  }

  /** POST /api/employees */
  create(request: CreateEmployeeRequest): Observable<EmployeeDetails> {
    if (environment.useMock) return createEmployeeMock(request);
    return this.http.post<EmployeeDetails>(apiUrl('/employees'), request);
  }
}
