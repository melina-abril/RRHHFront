import { AppEnvironment } from './environment.model';

/** Por defecto la aplicación levanta sin backend: los servicios devuelven sus mocks y el login es de demostración. */
export const environment: AppEnvironment = {
  apiBaseUrl: '/api',
  useMock: true,
  firebase: { apiKey: 'demo-key', authDomain: 'demo-rrhh.firebaseapp.com', projectId: 'demo-rrhh' },
  authEmulatorUrl: null,
};
