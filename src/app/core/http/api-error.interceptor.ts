import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ProblemDetail } from '../../shared/models/problem-detail';
import { ApiProblemError } from './api-error';

function isProblemDetail(value: unknown): value is ProblemDetail {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate['title'] === 'string' && typeof candidate['status'] === 'number' && typeof candidate['detail'] === 'string';
}

function toProblem(error: HttpErrorResponse): ProblemDetail {
  if (isProblemDetail(error.error)) return error.error;
  if (error.status === 0) return { title: 'Error de conexión', status: 0, detail: 'No se pudo conectar con el servidor.' };
  return { title: 'Error de solicitud', status: error.status, detail: 'No se pudo completar la solicitud.' };
}

/** Traduce cualquier error HTTP (también los de los mocks) a ApiProblemError con el ProblemDetail del backend. */
export const apiErrorInterceptor: HttpInterceptorFn = (request, next) =>
  next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) return throwError(() => new ApiProblemError(toProblem(error)));
      return throwError(() => error);
    }),
  );
