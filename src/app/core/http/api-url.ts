import { environment } from '../../../environments/environment';

/** URL completa de un servicio del backend: apiUrl('/products/12') → '/api/products/12'. */
export function apiUrl(path: string): string {
  const base = environment.apiBaseUrl.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}
