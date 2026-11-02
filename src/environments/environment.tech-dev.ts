import { AppEnvironment } from './environment.model';

/**
 * npm run start:tech-dev — contra el proyecto rrhh-tech-dev: el login va a su Firebase Auth y
 * proxy.conf.tech-dev.json manda /api a la función api desplegada en Cloud Functions (sin emuladores).
 */
export const environment: AppEnvironment = {
  apiBaseUrl: '/api',
  useMock: false,
  firebase: {
    apiKey: 'AIzaSyBWRIQBNI8NcZSbErmmo3O3H7ngmhBX2oM',
    authDomain: 'rrhh-tech-dev.firebaseapp.com',
    projectId: 'rrhh-tech-dev',
    appId: '1:974018624651:web:69b8732e9f175ca781e88e',
  },
  authEmulatorUrl: null,
};
