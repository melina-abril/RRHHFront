import { environment } from '../../environments/environment';
/** Armado de URL para requests al backend */
export function apiUrl(path: string): string {
  // paths del contrato ya traen '/api' (ej: /api/colaboradores)
  return `${environment.apiBaseUrl ?? ''}${path}`;
}
