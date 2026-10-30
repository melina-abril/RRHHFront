/** Respuesta paginada del backend. page empieza en 0. */
export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

/** Arma una página a partir de una lista completa (lo usan los mocks). */
export function toPage<T>(all: readonly T[], page: number, size: number): Page<T> {
  const start = page * size;
  return {
    items: all.slice(start, start + size),
    page,
    size,
    totalItems: all.length,
    totalPages: Math.max(1, Math.ceil(all.length / size)),
  };
}
