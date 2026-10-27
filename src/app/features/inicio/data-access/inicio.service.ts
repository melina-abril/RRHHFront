import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { apiUrl } from 'src/app/core/http/api-url';
import { mockResponse } from 'src/app/core/http/mock-response';
import { InicioSummaryResponse } from '../models/inicio.models';
import { resumenMock } from './inicio.mock';
import { LoadState } from 'src/app/shared/models/load-state';

@Injectable({ providedIn: 'root' })
export class InicioService {
  // Signal con el estado del resumen (pantalla inicio)
  public readonly resumen = signal<LoadState<InicioSummaryResponse>>({ status: 'loading' });

  constructor(private http: HttpClient) {
    this.getHomepageSummary();
  }

  // Llama al servicio GET /api/inicio/resumen
  public getHomepageSummary(): void {
    this.resumen.set({ status: 'loading' });
    if (environment.useMock) {
      // MOCK: datos dummy de ejemplo; reemplazar al conectar backend
      mockResponse(resumenMock).subscribe({
        next: data => this.resumen.set({ status: 'ready', data }),
        error: err => this.resumen.set({ status: 'error', message: 'No se pudo cargar el resumen de inicio.' })
      });
      return;
    }
    this.http.get<InicioSummaryResponse>(apiUrl('/api/inicio/resumen')).subscribe({
      next: data => this.resumen.set({ status: 'ready', data }),
      error: err => this.resumen.set({ status: 'error', message: 'No se pudo cargar el resumen de inicio.' })
    });
  }
}
