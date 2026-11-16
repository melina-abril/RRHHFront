# Gestión de RR.HH · Frontend

Aplicación Angular 22 para la gestión interna de Recursos Humanos.

## Arranque

Requiere Node.js compatible con Angular 22. Ejecuta `npm install` y `npm start` para abrir la aplicación en `http://localhost:4200` con datos de demostración, sin backend. El inicio de sesión de demostración acepta un correo y la contraseña `Demo1234!`.

Para usar la API local, inicia primero el backend en el puerto `8080` y ejecuta `npm run start:backend`. El proxy de desarrollo envía las peticiones `/api` a `http://localhost:8080`. Configura `FRONT_URL=http://localhost:4200` en el backend para permitir el origen del frontend. La sesión utiliza `POST /api/auth/login`, `GET /api/auth/me` y `POST /api/auth/logout`.

`npm run build` genera siempre la versión conectada al backend: `environment.production.ts` usa `/api` en el mismo origen, sin datos mock. Al desplegarla, configura el servidor web para dirigir `/api` al backend y servir la aplicación Angular en las demás rutas.

## Módulos

- Colaboradores (`/employees`): listado, alta y ficha del colaborador.
- Pantalla principal (`/dashboard`): indicadores y próximos eventos.
- Inicio de sesión (`/login`): acceso a los módulos internos; no aparece en el menú.

## Conexión con las otras capas

El frontend solo consume la API del backend en el puerto `8080`; no accede directamente a Firestore. Para desarrollo local con datos persistidos, inicia el emulador de Firestore del proyecto `demo-app` en `127.0.0.1:8085` según el README de la base de datos y configura el backend con `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Después inicia el backend y este frontend con `npm run start:backend`.
