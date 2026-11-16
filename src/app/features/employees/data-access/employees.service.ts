import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EMPTY, Observable, expand, reduce } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { EmployeeResponse } from '../models/employees.models';
import { listEmployeesMock } from './employees.mock';

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private readonly http = inject(HttpClient);

  /** GET /api/employees. Recorre todas las páginas porque este endpoint solo admite paginación. */
  listEmployees(): Observable<EmployeeResponse[]> {
    return this.fetchPage(0, 100).pipe(
      expand((result) => result.page + 1 < result.totalPages
        ? this.fetchPage(result.page + 1, 100)
        : EMPTY),
      reduce((all: EmployeeResponse[], result) => [...all, ...result.items], [] as EmployeeResponse[]),
    );
  }

  private fetchPage(page: number, size: number): Observable<Page<EmployeeResponse>> {
    if (environment.useMock) return listEmployeesMock(page, size);
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<EmployeeResponse>>(apiUrl('/api/employees'), { params });
  }
}
