import { ProblemDetail } from '../../shared/models/problem-detail';

/** Todo error HTTP llega a los servicios y páginas como ApiProblemError (lo arma apiErrorInterceptor). */
export class ApiProblemError extends Error {
  constructor(readonly problem: ProblemDetail) {
    super(problem.detail);
    this.name = 'ApiProblemError';
  }

  get status(): number {
    return this.problem.status;
  }

  /** Errores por campo (validación del backend, 400/422): { campo: ['mensaje'] }. */
  get fieldErrors(): Record<string, string[]> {
    return this.problem.errors ?? {};
  }
}

/** Mensaje para mostrar al usuario a partir de cualquier error. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiProblemError) return error.problem.detail;
  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}
