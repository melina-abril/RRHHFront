import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateEmployeeRequest, UpdateEmployeeResponse } from '../models/employee-edition.models';
import { environment } from 'src/environments/environment';
import { apiUrl } from 'src/app/core/http/api-url';
import { mockResponse } from 'src/app/core/http/mock-response';
import { updateEmployeeMock } from './employee-edition.mock';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeEditionService {
  private readonly http = inject(HttpClient);
  updateEmployee(id: string, req: UpdateEmployeeRequest): Observable<UpdateEmployeeResponse> {
    if (environment.useMock) {
      // MOCK: responde con datos de ejemplo
      return mockResponse(updateEmployeeMock(id, req));
    }
    return this.http.put<UpdateEmployeeResponse>(apiUrl(`/api/employee-edition/${id}`), req, { withCredentials: true });
  }
}
