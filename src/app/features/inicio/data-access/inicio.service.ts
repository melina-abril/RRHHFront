import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { InicioResumen } from '../models/inicio.models';
import { INICIO_RESUMEN_MOCK } from './inicio.mock';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InicioService {
  private readonly http = inject(HttpClient);

  getResumen(): Observable<InicioResumen> {
    if (environment.useMock) {
      return mockResponse(INICIO_RESUMEN_MOCK);
    }
    return this.http.get<InicioResumen>(apiUrl('/api/inicio/resumen'));
  }
}
