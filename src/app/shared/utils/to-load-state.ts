import { Observable, catchError, map, of, startWith } from 'rxjs';
import { errorMessage } from '../../core/http/api-error';
import { LoadState } from '../models/load-state';

function isEmptyData(data: unknown): boolean {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object' && 'items' in data && Array.isArray(data.items)) return data.items.length === 0;
  return false;
}

/**
 * Observable de datos → Observable<LoadState>: emite 'loading', después 'ready' / 'empty', o 'error' con el
 * mensaje del backend. Uso típico con toSignal + switchMap (ver el módulo de ejemplo).
 */
export function toLoadState<T>(source: Observable<T>, isEmpty: (data: T) => boolean = isEmptyData): Observable<LoadState<T>> {
  return source.pipe(
    map((data): LoadState<T> => (isEmpty(data) ? { status: 'empty' } : { status: 'ready', data })),
    startWith<LoadState<T>>({ status: 'loading' }),
    catchError((error: unknown) => of<LoadState<T>>({ status: 'error', message: errorMessage(error) })),
  );
}
