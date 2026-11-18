# Gestión de RR.HH

Frontend Angular de RH smart. Esta estructura inicial incluye el inicio de sesión y una página de bienvenida; aún no hay módulos funcionales.

## Desarrollo

Requiere Node.js compatible con Angular 22. Ejecuta `npm install` y `npm start` para iniciar en `http://localhost:4200` con el modo de demostración. Puedes ingresar con cualquier correo válido y la contraseña `Demo1234!`.

Para conectarte al backend local, inicia el backend en el puerto 8080 y ejecuta `npm run start:backend`. El proxy envía `/api` a `http://localhost:8080`. Configura `FRONT_URL=http://localhost:4200` en el backend para permitir el origen del frontend. La sesión utiliza `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`; el backend también ofrece `GET /api/health`. No hay otros servicios aprobados todavía.

`npm run build` compila siempre con `environment.production.ts`: desactiva los mocks y utiliza la API bajo `/api` en el mismo origen. Al desplegar, dirige ese prefijo al backend.

La base Firestore se gestiona por separado en el repositorio del backend. Para desarrollo, su emulador utiliza `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`; el frontend no accede directamente a Firestore.

## Módulos

Todavía no se han generado módulos funcionales.
