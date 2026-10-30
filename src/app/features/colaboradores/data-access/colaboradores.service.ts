import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { mockResponse } from '../../../core/http/mock-response';
import { apiUrl } from '../../../core/http/api-url';
import type { Page } from '../../../shared/models/page';
import type { LoadState } from '../../../shared/models/load-state';
import type {
  ColaboradorResumen,
  ColaboradorFicha,
  FiltroColaboradores,
  CrearColaboradorRequest,
  EditarColaboradorRequest
} from '../models/colaboradores.models';
import { COLABORADORES_MOCK_PAGE, COLABORADORES_MOCK_FICHAS } from './colaboradores.mock';
import { toSignal } from 'rxjs-interop';
import { lastValueFrom, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ColaboradoresService {
  private http = inject(HttpClient);

  async listColaboradores(
    filtro: FiltroColaboradores = {},
    page = 0,
    size = 20
  ): Promise<Page<ColaboradorResumen>> {
    if (environment.useMock) {
      // Simula búsqueda y filtros mínimamente
      let items = COLABORADORES_MOCK_PAGE.items;
      if (filtro.busqueda) {
        const q = filtro.busqueda.toLowerCase();
        items = items.filter(
          c => c.nombreCompleto.toLowerCase().includes(q) || c.legajo.toLowerCase().includes(q)
        );
      }
      if (filtro.categoria) {
        items = items.filter(c => c.categoria === filtro.categoria);
      }
      if (filtro.cliente) {
        items = items.filter(c => c.cliente?.toLowerCase().includes(filtro.cliente!.toLowerCase()));
      }
      if (filtro.proyecto) {
        items = items.filter(c => c.proyecto?.toLowerCase().includes(filtro.proyecto!.toLowerCase()));
      }
      if (filtro.estado) {
        items = items.filter(c => c.estado === filtro.estado);
      }
      const start = page * size;
      const pagedItems = items.slice(start, start + size);
      return await mockResponse({
        ...COLABORADORES_MOCK_PAGE,
        items: pagedItems,
        page,
        size,
        total: items.length
      }).toPromise();
    }
    const params: any = { page, size };
    if (filtro.busqueda) params.busqueda = filtro.busqueda;
    if (filtro.categoria) params.categoria = filtro.categoria;
    if (filtro.cliente) params.cliente = filtro.cliente;
    if (filtro.proyecto) params.proyecto = filtro.proyecto;
    if (filtro.estado) params.estado = filtro.estado;
    return lastValueFrom(this.http.get<Page<ColaboradorResumen>>(apiUrl('/api/colaboradores'), { params }));
  }

  async getColaborador(id: number): Promise<ColaboradorFicha> {
    if (environment.useMock) {
      const ficha = COLABORADORES_MOCK_FICHAS[id];
      if (!ficha) return await Promise.reject({ error: 'No encontrado' });
      return await mockResponse(ficha).toPromise();
    }
    return lastValueFrom(this.http.get<ColaboradorFicha>(apiUrl(`/api/colaboradores/${id}`)));
  }

  async altaColaborador(req: CrearColaboradorRequest): Promise<ColaboradorFicha> {
    if (environment.useMock) {
      // Devuelve la ficha dummy como si fuese un alta (sin persistencia real)
      const mockId = 50 + Math.floor(Math.random() * 1000);
      return await mockResponse({
        ...req,
        id: mockId,
        legajo: 'TFB-' + mockId.toString().padStart(4, '0'),
        estado: 'ACTIVO',
        asignaciones: [],
        beneficios: [],
        documentos: [],
        evaluaciones: [],
        bitacora: [],
        remuneraciones: [],
        bonos: []
      } as ColaboradorFicha).toPromise();
    }
    return lastValueFrom(this.http.post<ColaboradorFicha>(apiUrl('/api/colaboradores'), req));
  }

  async editarColaborador(id: number, req: EditarColaboradorRequest): Promise<ColaboradorFicha> {
    if (environment.useMock) {
      // Devuelve mock actualizado
      const base = COLABORADORES_MOCK_FICHAS[id];
      if (!base) return await Promise.reject({ error: 'No encontrado' });
      return await mockResponse({ ...base, ...req } as ColaboradorFicha).toPromise();
    }
    return lastValueFrom(this.http.put<ColaboradorFicha>(apiUrl(`/api/colaboradores/${id}`), req));
  }

  async egresoColaborador(id: number, motivo?: string): Promise<void> {
    if (environment.useMock) {
      // Simula egreso
      if (!(id in COLABORADORES_MOCK_FICHAS)) return await Promise.reject({ error: 'No encontrado' });
      return await mockResponse(undefined).toPromise();
    }
    return lastValueFrom(this.http.post<void>(apiUrl(`/api/colaboradores/${id}/egreso`), null, { params: motivo ? { motivo } : {} }));
  }

  async reingresoColaborador(id: number, motivo?: string): Promise<ColaboradorFicha> {
    if (environment.useMock) {
      const ficha = COLABORADORES_MOCK_FICHAS[id];
      if (!ficha) return await Promise.reject({ error: 'No encontrado' });
      return await mockResponse({
        ...ficha,
        estado: 'ACTIVO',
        bitacora: [...(ficha.bitacora ?? []), `Reingreso: ${new Date().toISOString().slice(0,10)}`]
      }).toPromise();
    }
    return lastValueFrom(this.http.post<ColaboradorFicha>(apiUrl(`/api/colaboradores/${id}/reingreso`), null, { params: motivo ? { motivo } : {} }));
  }
}
