import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { EmployeeRequest, EmployeeResponse } from '../models/employees.models';
import { createEmployeeMock, getEmployeeMock, listEmployeesMock } from './employees.mock';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly http = inject(HttpClient);

  list(page: number, size: number): Observable<Page<EmployeeResponse>> {
    if (environment.useMock) return listEmployeesMock(page, size);
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<EmployeeResponse>>(apiUrl('/employees'), { params });
  }

  get(id: string): Observable<EmployeeResponse> {
    if (environment.useMock) return getEmployeeMock(id);
    return this.http.get<EmployeeResponse>(apiUrl(`/employees/${encodeURIComponent(id)}`));
  }

  create(request: EmployeeRequest): Observable<EmployeeResponse> {
    if (environment.useMock) return createEmployeeMock(request);
    return this.http.post<EmployeeResponse>(apiUrl('/employees'), request);
  }
}
