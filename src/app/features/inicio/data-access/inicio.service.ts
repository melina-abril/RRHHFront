import { Injectable, effect, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { mockResponse } from 'src/app/core/http/mock-response';
import { apiUrl } from 'src/app/core/http/api-url';
import { InicioSummaryResponse } from '../models/inicio.models';
import { inicioSummaryMock } from './inicio.mock';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InicioService {
  constructor(private http: HttpClient) {}

  public getHomepageSummary(): Observable<InicioSummaryResponse> {
    if (environment.useMock) {
      // MOCK: responde el mock local (reemplazar al conectar backend)
      return mockResponse(inicioSummaryMock);
    }
    return this.http.get<InicioSummaryResponse>(apiUrl('/api/inicio/resumen'));
  }
}
