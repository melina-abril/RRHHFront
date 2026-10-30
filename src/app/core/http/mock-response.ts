import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
/**
 * Emite un observable con el mock tras un pequeño delay.
 * Útil para simular tiempos de red en modo useMock.
 */
export function mockResponse<T>(data: T) {
  // De 200 a 400 ms simulando red
  return of(data).pipe(delay(200 + Math.random() * 200));
}
