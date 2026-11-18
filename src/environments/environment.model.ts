export interface AppEnvironment {
  /** Base de las APIs del backend: cada servicio arma su URL con apiUrl(path). */
  apiBaseUrl: string;
  /** true: cada servicio de datos devuelve sus mocks y no llama al backend. */
  useMock: boolean;
}
