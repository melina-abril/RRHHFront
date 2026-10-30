import { AppEnvironment } from './environment.model';

/** npm run start:backend — contra el backend local: proxy.conf.json manda /api a http://localhost:8080. */
export const environment: AppEnvironment = {
  apiBaseUrl: '/api',
  useMock: false,
};
