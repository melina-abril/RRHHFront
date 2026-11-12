import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { Employee, EmployeeFilters, EmployeeRequest } from '../models/employee-management.models';
import { createEmployeeMock, getEmployeeMock, listEmployeesMock } from './employee-management.mock';

@Injectable({ providedIn: 'root' })
export class EmployeeManagementService {
  private readonly http = inject(HttpClient);

  /** GET /api/employees */
  list(filters: EmployeeFilters): Observable<Page<Employee>> {
    if (environment.useMock) return listEmployeesMock(filters);
    let params = new HttpParams().set('page', filters.page).set('size', filters.size);
    if (filters.search.trim()) params = params.set('search', filters.search.trim());
    return this.http.get<Page<Employee>>(apiUrl('/employees'), { params });
  }

  /** GET /api/employees/:id */
  get(id: string): Observable<Employee> {
    if (environment.useMock) return getEmployeeMock(id);
    return this.http.get<Employee>(apiUrl(`/employees/${encodeURIComponent(id)}`));
  }

  /** POST /api/employees */
  create(request: EmployeeRequest): Observable<Employee> {
    if (environment.useMock) return createEmployeeMock(request);
    return this.http.post<Employee>(apiUrl('/employees'), request);
  }
}
