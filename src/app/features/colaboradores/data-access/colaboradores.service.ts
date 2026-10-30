import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { mockResponse } from '../../../core/http/mock-response';
import { apiUrl } from '../../../core/http/api-url';
import type {
  ColaboradorResumen,
  ColaboradorFicha,
  FiltroColaboradores,
  CrearColaboradorRequest,
  EditarColaboradorRequest
} from '../models/colaboradores.models';
import type { Page } from '../../../shared/models/page';
import { COLABORADORES_MOCK_PAGE, COLABORADOR_FICHA_MOCK } from './colaboradores.mock';

@Injectable({ providedIn: 'root' })
export class ColaboradoresService {
  private readonly http = inject(HttpClient);

  listColaboradores(filtro: FiltroColaboradores = {}, page = 0, size = 20) {
    if (environment.useMock) {
      return mockResponse<Page<ColaboradorResumen>>(COLABORADORES_MOCK_PAGE);
    }
    // Mapea los filtros como query params
    const params: Record<string, string> = {};
    if (filtro.busqueda) params['busqueda'] = filtro.busqueda;
    if (filtro.categoria) params['categoria'] = filtro.categoria;
    if (filtro.cliente) params['cliente'] = filtro.cliente;
    if (filtro.proyecto) params['proyecto'] = filtro.proyecto;
    if (filtro.estado)   params['estado'] = filtro.estado;
    params['page'] = String(page);
    params['size'] = String(size);
    return this.http.get<Page<ColaboradorResumen>>(apiUrl('/api/colaboradores'), { params });
  }

  getColaborador(id: number) {
    if (environment.useMock) {
      // Devuelve el mock por id si existe
      const found = COLABORADORES_MOCK_PAGE.items.find(c => c.id === id);
      if (found) {
        return mockResponse<ColaboradorFicha>({ ...COLABORADOR_FICHA_MOCK, id: found.id, nombre: found.nombreCompleto.split(' ')[0], apellido: found.nombreCompleto.split(' ').slice(1).join(' '), legajo: found.legajo, categoria: found.categoria });
      } else {
        // Simula error 404
        return mockResponse<never>(undefined as never);
      }
    }
    return this.http.get<ColaboradorFicha>(apiUrl(`/api/colaboradores/${id}`));
  }

  altaColaborador(req: CrearColaboradorRequest) {
    if (environment.useMock) {
      // Devuelve ficha mock con los datos enviados
      const id = 100 + Math.floor(Math.random() * 1000);
      return mockResponse<ColaboradorFicha>({
        ...COLABORADOR_FICHA_MOCK,
        ...req,
        id,
        nombre: req.nombre,
        apellido: req.apellido,
        legajo: `TFB-${id.toString().padStart(4, '0')}`,
        estado: 'ACTIVO',
        categoria: req.categoria
      });
    }
    return this.http.post<ColaboradorFicha>(apiUrl('/api/colaboradores'), req);
  }

  editarColaborador(id: number, req: EditarColaboradorRequest) {
    if (environment.useMock) {
      // Devuelve ficha mock actualizada
      return mockResponse<ColaboradorFicha>({ ...COLABORADOR_FICHA_MOCK, ...req, id });
    }
    return this.http.put<ColaboradorFicha>(apiUrl(`/api/colaboradores/${id}`), req);
  }

  egresoColaborador(id: number, motivo?: string) {
    if (environment.useMock) {
      // Simula 204
      return mockResponse<null>(null);
    }
    return this.http.post<void>(apiUrl(`/api/colaboradores/${id}/egreso`), {}, { params: motivo ? { motivo } : undefined });
  }

  reingresoColaborador(id: number, motivo?: string) {
    if (environment.useMock) {
      // Devuelve ficha ACTIVO
      return mockResponse<ColaboradorFicha>({ ...COLABORADOR_FICHA_MOCK, id, estado: 'ACTIVO' });
    }
    return this.http.post<ColaboradorFicha>(apiUrl(`/api/colaboradores/${id}/reingreso`), {}, { params: motivo ? { motivo } : undefined });
  }
}
