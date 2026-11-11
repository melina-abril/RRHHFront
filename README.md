# Gestión de RR.HH · frontend

Aplicación Angular 22. Esta primera estructura incluye el acceso y la sesión provistos por la arquitectura, además de una página de inicio. Todavía no hay módulos de funcionalidades.

## Desarrollo

Requiere Node.js y npm. Ejecuta `npm install` y `npm start` para abrir la aplicación en `http://localhost:4200` con la sesión de demostración. En modo mock, la contraseña es `Demo1234!`.

Para conectarla al backend local, inicia el backend en el puerto `8080` y ejecuta `npm run start:backend`. El proxy de desarrollo dirige `/api` a ese puerto. El backend publica `GET /api/health`, `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`; esta estructura solo utiliza los endpoints de sesión. El backend debe permitir `http://localhost:4200` mediante su variable `FRONT_URL`.

`npm run build` genera la versión de producción, que siempre usa el backend del mismo origen bajo `/api` y no utiliza mocks. Sirve la aplicación detrás de un proxy que dirija ese prefijo al backend.

La base Cloud Firestore se ejecuta por separado; el frontend no se conecta directamente a ella. En desarrollo, su emulador escucha en `127.0.0.1:8085` y el backend configura la conexión mediante `FIREBASE_PROJECT_ID` y `FIRESTORE_EMULATOR_HOST`.

## Módulos

Todavía no se han incorporado módulos de funcionalidades.
