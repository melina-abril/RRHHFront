import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Devuelve un Observable del dato recibido, con un delay corto para simular la red.
// Se usa en modo useMock para que la app funcione sin backend
export function mockResponse<T>(data: T) {
  // 500 ms de delay para simular llamada asíncrona; reemplazar al conectar backend
  return of(data).pipe(delay(500));
}
