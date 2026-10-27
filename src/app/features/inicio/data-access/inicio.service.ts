import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { computed, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ResumenDashboard } from '../models/inicio.models';
import { MOCK_RESUMEN_DASHBOARD } from './inicio.mock';
import { Observable } from 'rxjs';

// Reemplazar imports rotos por rutas correctas
import { apiUrl } from '../../../../app/core/http/api-url';
import { mockResponse } from '../../../../app/core/http/mock-response';

@Injectable({ providedIn: 'root' })
export class InicioService {
  private readonly http = inject(HttpClient);

  /**
   * Obtiene el resumen general para el dashboard de inicio.
   * Si environment.useMock es true, retorna datos mock (reemplazar al conectar backend).
   */
  getDashboardSummary(): Observable<ResumenDashboard> {
    if (environment.useMock) {
      // Mock para levantar sin backend: reemplazar por llamado real
      return mockResponse(MOCK_RESUMEN_DASHBOARD);
    }
    return this.http.get<ResumenDashboard>(apiUrl('/inicio/resumen'));
  }
}
