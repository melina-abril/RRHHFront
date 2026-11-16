# Gestión de RR.HH. · Frontend

Aplicación Angular 22 para la gestión interna de Recursos Humanos.

## Arranque

Requiere Node.js y npm. Ejecuta `npm install` y `npm start` para trabajar con los datos de demostración. Abre `http://localhost:4200`. Para usar el backend local, inicia primero su API en el puerto `8080` y ejecuta `npm run start:backend`; el proxy de desarrollo dirige `/api` a esa API. El inicio de sesión utiliza `POST /api/auth/login`, `GET /api/auth/me` y `POST /api/auth/logout`. En el emulador, la cuenta de demostración documentada por la base de datos es `rrhh@example.com` con contraseña `Demo1234!`.

`npm run build` genera la versión de producción: utiliza el backend, no los mocks, y espera que la API esté disponible en el mismo origen bajo `/api`. Configura el servidor de despliegue para dirigir ese prefijo al backend.

## Módulos

- **Colaboradores** (`/employees`): listado, alta y ficha individual.
- **Inicio** (`/dashboard`): indicadores y próximos eventos.
- **Inicio de sesión** (`/login`): acceso a los módulos internos.

## Conexión con las otras capas

El frontend escucha en el puerto `4200` y consume únicamente la API del backend en el puerto `8080`, con prefijo `/api`. El backend debe permitir `http://localhost:4200` mediante su variable `FRONT_URL`. La base de datos es Firestore; el frontend no se conecta directamente a ella. Para desarrollo con datos persistidos, inicia el emulador de Firestore en `127.0.0.1:8085` y configura el backend con `FIREBASE_PROJECT_ID=demo-app`, `GCLOUD_PROJECT=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`, siguiendo los README de esas capas.
