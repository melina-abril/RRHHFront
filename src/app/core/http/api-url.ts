import { environment } from '../../../environments/environment';

/**
 * URL completa de un servicio del backend: apiUrl('/products/12') → '/api/products/12'. El path va SIN el prefijo de
 * apiBaseUrl; si igual viene con él (apiUrl('/api/products')) no se duplica.
 */
export function apiUrl(path: string): string {
  const base = environment.apiBaseUrl.replace(/\/+$/, '');
  const basePath = base.replace(/^[a-z]+:\/\/[^/]+/i, '').replace(/^\/+/, '');
  const relative = path.replace(/^\/+/, '');
  const clean = basePath && relative.startsWith(`${basePath}/`) ? relative.slice(basePath.length + 1) : relative;
  return `${base}/${clean}`;
}
