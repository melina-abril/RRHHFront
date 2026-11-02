/** Configuración web de Firebase (consola de Firebase → Configuración del proyecto → Tus apps). */
export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId?: string;
}

export interface AppEnvironment {
  /** Base de las APIs del backend: cada servicio arma su URL con apiUrl(path). */
  apiBaseUrl: string;
  /** true: cada servicio de datos devuelve sus mocks y no llama al backend (ni a Firebase Auth). */
  useMock: boolean;
  /** Proyecto de Firebase del login (Firebase Auth). */
  firebase: FirebaseWebConfig;
  /** URL del emulador de Auth (ej. http://127.0.0.1:9099); null contra el proyecto real. */
  authEmulatorUrl: string | null;
}
