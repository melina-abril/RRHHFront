import { AppEnvironment } from './environment.model';

/**
 * npm run start:real — contra el proyecto real rrhh-4caf3: el login va a Firebase Auth real y proxy.conf.real.json
 * manda /api a la función api del emulador de Functions del backend (npm run start:real en su repo), que lee y
 * escribe en la Firestore real.
 */
export const environment: AppEnvironment = {
  apiBaseUrl: '/api',
  useMock: false,
  firebase: {
    apiKey: 'AIzaSyBb3m6ADi4yBabLqvQ_VBBc1Xu2nucFTsU',
    authDomain: 'rrhh-4caf3.firebaseapp.com',
    projectId: 'rrhh-4caf3',
    appId: '1:291311547472:web:dfaee8b4f466c564d6cd55',
  },
  authEmulatorUrl: null,
};
