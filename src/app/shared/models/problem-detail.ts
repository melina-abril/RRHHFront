/** Error del backend (RFC 9457 Problem Details). */
export interface ProblemDetail {
  title: string;
  status: number;
  detail: string;
  /** Código de negocio opcional (ej. 'STOCK_NOT_AVAILABLE'). */
  code?: string;
  /** Errores de validación por campo. */
  errors?: Record<string, string[]>;
}
