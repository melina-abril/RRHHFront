import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { InicioResumen } from '../models/inicio.models';
import { mockResponse } from '../../../core/http/mock-response';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InicioService {
  /**
   * Devuelve el resumen general con indicadores de inicio.
   */
  getResumen(): Observable<InicioResumen> {
    if (environment.useMock) {
      // Datos de ejemplo realistas
      const { INICIO_RESUMEN_MOCK } = require('./inicio.mock');
      return mockResponse(INICIO_RESUMEN_MOCK);
    }
    return this.http.get<InicioResumen>(apiUrl('/api/inicio/resumen'));
  }

  constructor(private readonly http: HttpClient) {}
}
