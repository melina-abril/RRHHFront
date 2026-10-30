import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { mockResponse } from '../../../core/http/mock-response';
import { Page } from '../../../shared/models/page';
import {
  ColaboradorResumen,
  FiltroColaboradores,
  ColaboradorFicha,
  CrearColaboradorRequest,
  EditarColaboradorRequest
} from '../models/colaboradores.models';
import { Observable, of } from 'rxjs';
import { colaboradoresPageMock, colaboradorFichaMock } from './colaboradores.mock';

@Injectable({ providedIn: 'root' })
export class ColaboradoresService {
  private readonly http = inject(HttpClient);

  listColaboradores(filtro: FiltroColaboradores & { page?: number; size?: number }): Observable<Page<ColaboradorResumen>> {
    if (environment.useMock) {
      return mockResponse(colaboradoresPageMock);
    }
    const params: Record<string, string> = {};
    if (filtro.busqueda) params['busqueda'] = filtro.busqueda;
    if (filtro.categoria) params['categoria'] = filtro.categoria;
    if (filtro.cliente) params['cliente'] = filtro.cliente;
    if (filtro.proyecto) params['proyecto'] = filtro.proyecto;
    if (filtro.estado) params['estado'] = filtro.estado;
    if (filtro.page) params['page'] = String(filtro.page);
    if (filtro.size) params['size'] = String(filtro.size);
    return this.http.get<Page<ColaboradorResumen>>(apiUrl('/api/colaboradores'), { params });
  }

  getColaborador(id: number): Observable<ColaboradorFicha> {
    if (environment.useMock) {
      return mockResponse(colaboradorFichaMock);
    }
    return this.http.get<ColaboradorFicha>(apiUrl(`/api/colaboradores/${id}`));
  }

  altaColaborador(req: CrearColaboradorRequest): Observable<ColaboradorFicha> {
    if (environment.useMock) {
      // Simula legajo generado y estado inicial
      const nuevo: ColaboradorFicha = {
        ...colaboradorFichaMock,
        ...req,
        id: Math.floor(1000 + Math.random() * 9000),
        legajo: `TFB-${String(Math.floor(1000 + Math.random() * 8999)).padStart(4, '0')}`,
        estado: 'ACTIVO',
      };
      return mockResponse(nuevo);
    }
    return this.http.post<ColaboradorFicha>(apiUrl('/api/colaboradores'), req);
  }

  editarColaborador(id: number, req: EditarColaboradorRequest): Observable<ColaboradorFicha> {
    if (environment.useMock) {
      // Simula edición
      return mockResponse({ ...colaboradorFichaMock, ...req, id });
    }
    return this.http.put<ColaboradorFicha>(apiUrl(`/api/colaboradores/${id}`), req);
  }

  egresoColaborador(id: number, motivo?: string): Observable<void> {
    if (environment.useMock) {
      return mockResponse(undefined);
    }
    return this.http.post<void>(apiUrl(`/api/colaboradores/${id}/egreso`), {}, {
      params: motivo ? { motivo } : {}
    });
  }

  reingresoColaborador(id: number, motivo?: string): Observable<ColaboradorFicha> {
    if (environment.useMock) {
      // Simula nuevo período con mismo legajo
      return mockResponse({ ...colaboradorFichaMock, id });
    }
    return this.http.post<ColaboradorFicha>(apiUrl(`/api/colaboradores/${id}/reingreso`), {}, {
      params: motivo ? { motivo } : {}
    });
  }
}
