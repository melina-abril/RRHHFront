import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { mockResponse } from 'src/app/core/http/mock-response';
import { apiUrl } from 'src/app/core/http/api-url';
import { InicioSummaryResponse } from '../models/inicio.models';
import { INICIO_SUMMARY_MOCK } from './inicio.mock';
import { LoadState } from 'src/app/shared/models/load-state';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InicioService {
  // Señal de estado de carga del resumen general
  public readonly summaryState = signal<LoadState<InicioSummaryResponse>>({ status: 'loading' });

  constructor(private http: HttpClient) {}

  public loadSummary(): void {
    this.summaryState.set({ status: 'loading' });
    if (environment.useMock) {
      // MOCK: datos de ejemplo simulan el backend (reemplazar al conectar el backend real)
      mockResponse(INICIO_SUMMARY_MOCK).subscribe({
        next: (data) => this.summaryState.set({ status: 'ready', data }),
        error: () => this.summaryState.set({ status: 'error', message: 'No se pudo cargar el resumen de inicio.' })
      });
      return;
    }
    this.http.get<InicioSummaryResponse>(apiUrl('/api/inicio/resumen'))
      .pipe(
        map(res => ({ status: 'ready', data: res }) as LoadState<InicioSummaryResponse>),
        catchError(() => of({ status: 'error', message: 'No se pudo cargar el resumen de inicio.' } as LoadState<InicioSummaryResponse>))
      )
      .subscribe(state => this.summaryState.set(state));
  }
}
