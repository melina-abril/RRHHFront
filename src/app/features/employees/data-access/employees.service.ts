import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { EmployeeDto, EmployeeRequest, EmployeesPageQuery } from '../models/employees.models';
import { createEmployeeMock, getEmployeeByIdMock, leaveEmployeeMock, listEmployeesMock, rejoinEmployeeMock, updateEmployeeMock } from './employees.mock';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly http = inject(HttpClient);

  listEmployees(filters: EmployeesPageQuery): Observable<Page<EmployeeDto>> {
    if (environment.useMock) return listEmployeesMock(filters);
    let params = new HttpParams().set('page', filters.page).set('size', filters.size);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.departmentId) params = params.set('departmentId', filters.departmentId);
    if (filters.positionId) params = params.set('positionId', filters.positionId);
    return this.http.get<Page<EmployeeDto>>(apiUrl('/employees'), { params });
  }

  createEmployee(request: EmployeeRequest): Observable<EmployeeDto> {
    return environment.useMock ? createEmployeeMock(request) : this.http.post<EmployeeDto>(apiUrl('/employees'), request);
  }

  getEmployeeById(id: string): Observable<EmployeeDto> {
    return environment.useMock ? getEmployeeByIdMock(id) : this.http.get<EmployeeDto>(apiUrl(`/employees/${encodeURIComponent(id)}`));
  }

  updateEmployee(id: string, request: EmployeeRequest): Observable<EmployeeDto> {
    return environment.useMock ? updateEmployeeMock(id, request) : this.http.put<EmployeeDto>(apiUrl(`/employees/${encodeURIComponent(id)}`), request);
  }

  leaveEmployee(id: string): Observable<EmployeeDto> {
    return environment.useMock ? leaveEmployeeMock(id) : this.http.post<EmployeeDto>(apiUrl(`/employees/${encodeURIComponent(id)}/leave`), {});
  }

  rejoinEmployee(id: string, hireDate: string): Observable<EmployeeDto> {
    return environment.useMock ? rejoinEmployeeMock(id, hireDate) : this.http.post<EmployeeDto>(apiUrl(`/employees/${encodeURIComponent(id)}/rejoin`), { hireDate });
  }
}
