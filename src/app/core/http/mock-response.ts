import { Observable, delay, mergeMap, of, throwError, timer } from 'rxjs';
import { ApiProblemError } from './api-error';

const MOCK_DELAY_MS = 250;

/** Respuesta MOCK (environment.useMock): se reemplaza sola al conectar el backend. */
export function mockResponse<T>(data: T): Observable<T> {
  return of(structuredClone(data)).pipe(delay(MOCK_DELAY_MS));
}

/** Error MOCK con la misma forma que el backend (ProblemDetail), para mostrar los estados de error. */
export function mockError(status: number, detail: string, errors?: Record<string, string[]>): Observable<never> {
  return timer(MOCK_DELAY_MS).pipe(
    mergeMap(() => throwError(() => new ApiProblemError({ title: 'No se pudo completar la operación', status, detail, errors }))),
  );
}
