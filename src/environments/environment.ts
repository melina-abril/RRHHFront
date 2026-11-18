import { AppEnvironment } from './environment.model';

/** Por defecto la aplicación levanta sin backend: los servicios devuelven sus mocks. */
export const environment: AppEnvironment = {
  apiBaseUrl: '/api',
  useMock: true,
};
