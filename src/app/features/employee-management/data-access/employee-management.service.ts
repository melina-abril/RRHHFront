import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { EmployeeListQuery, EmployeeRequest, EmployeeResponse } from '../models/employee-management.models';
import { createEmployeeMock, getEmployeeMock, listEmployeesMock } from './employee-management.mock';

@Injectable({ providedIn: 'root' })
export class EmployeeManagementService {
  private readonly http = inject(HttpClient);

  listEmployees(query: EmployeeListQuery): Observable<Page<EmployeeResponse>> {
    if (environment.useMock) return listEmployeesMock(query);
    let params = new HttpParams().set('page', query.page).set('size', query.size);
    if (query.search.trim()) params = params.set('search', query.search.trim());
    return this.http.get<Page<EmployeeResponse>>(apiUrl('/api/employees'), { params });
  }

  getEmployee(id: string): Observable<EmployeeResponse> {
    if (environment.useMock) return getEmployeeMock(id);
    return this.http.get<EmployeeResponse>(apiUrl(`/api/employees/${encodeURIComponent(id)}`));
  }

  createEmployee(request: EmployeeRequest): Observable<EmployeeResponse> {
    if (environment.useMock) return createEmployeeMock(request);
    return this.http.post<EmployeeResponse>(apiUrl('/api/employees'), request);
  }
}
