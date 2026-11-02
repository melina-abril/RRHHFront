import { AppEnvironment } from './environment.model';

/**
 * npm run start:backend — contra los emuladores de Firebase del backend (npm start en su repo): el login va al
 * emulador de Auth y proxy.conf.json manda /api a la función api del emulador de Functions.
 */
export const environment: AppEnvironment = {
  apiBaseUrl: '/api',
  useMock: false,
  firebase: { apiKey: 'demo-key', authDomain: 'demo-rrhh.firebaseapp.com', projectId: 'demo-rrhh' },
  authEmulatorUrl: 'http://127.0.0.1:9099',
};
