import { AppEnvironment } from './environment.model';

/**
 * npm run build — lo que se despliega: siempre contra el backend real, nunca con mocks. La API se sirve en el mismo
 * origen bajo /api (proxy reverso del hosting): la cookie de sesión es HttpOnly + SameSite y solo viaja así.
 */
export const environment: AppEnvironment = {
  apiBaseUrl: '/api',
  useMock: false,
};
