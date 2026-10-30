import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmployeeProfile } from '../models/employee-profile.models';
import { mockResponse } from 'src/app/core/http/mock-response';
import { EMPLOYEE_PROFILE_MOCK } from './employee-profile.mock';

@Injectable({ providedIn: 'root' })
export class EmployeeProfileService {
  private readonly http = inject(HttpClient);

  // GET /api/employee-profile/{legajo}
  getEmployeeProfile(legajo: string): Observable<EmployeeProfile> {
    if (environment.useMock) {
      // MOCK: Devuelve la ficha de ejemplo
      return mockResponse(EMPLOYEE_PROFILE_MOCK);
    }
    return this.http.get<EmployeeProfile>(`/api/employee-profile/${encodeURIComponent(legajo)}`);
  }
}
