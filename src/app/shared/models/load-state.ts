/** Estado de una carga de datos. En el template: @let state = productsState(); y @switch (state.status). */
export type LoadState<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string };
