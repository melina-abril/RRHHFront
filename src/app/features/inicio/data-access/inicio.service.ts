import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { InicioSummaryResponse } from '../models/inicio.models';
import { mockResponse } from 'src/app/core/http/mock-response';
import { inicioSummaryMock } from './inicio.mock';
import { apiUrl } from 'src/app/core/http/api-url';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InicioService {
  private http = inject(HttpClient);

  getHomepageSummary(): Observable<InicioSummaryResponse> {
    if (environment.useMock) {
      // Modo mock: devuelve datos simulados
      return mockResponse(inicioSummaryMock);
    }
    return this.http.get<InicioSummaryResponse>(apiUrl('/inicio/resumen'));
  }
}
