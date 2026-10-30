import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EmployeeOnboardingRequest, EmployeeDto } from '../models/employee-onboarding.models';
import { Observable } from 'rxjs';
import { MOCK_EMPLOYEE_ONBOARDING } from './employee-onboarding.mock';
import { apiUrl } from 'src/app/core/http/api-url';

@Injectable({ providedIn: 'root' })
export class EmployeeOnboardingService {
  private readonly http = inject(HttpClient);

  createEmployee(data: EmployeeOnboardingRequest): Observable<EmployeeDto> {
    if (environment.useMock) {
      // MOCK: simula alta de colaborador (reemplazar al conectar backend)
      return MOCK_EMPLOYEE_ONBOARDING.createEmployee(data);
    }
    return this.http.post<EmployeeDto>(apiUrl('/api/employee-onboarding'), data, { withCredentials: true });
  }
}
