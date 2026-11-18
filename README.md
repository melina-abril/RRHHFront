# Gestión de RR.HH — frontend

Estructura inicial en Angular 22. Todavía no hay módulos de funcionalidades; la aplicación muestra una página de inicio y la pantalla de acceso.

## Desarrollo

Instala las dependencias con `npm install` y ejecuta `npm start` para iniciar la aplicación en `http://localhost:4200` con la sesión simulada. En este modo puedes ingresar con un correo válido y la contraseña `Demo1234!`.

Para conectarte al backend local, inicia primero su servidor en el puerto `8080` y después ejecuta `npm run start:backend`. El proxy envía las solicitudes `/api` al backend; la sesión utiliza `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`. El backend debe permitir el origen `http://localhost:4200` mediante `FRONT_URL`. El backend y el emulador de Firestore son capas independientes: este frontend no accede directamente a la base de datos.

`npm run build` genera la versión de producción con `useMock: false`. En producción, sirve el frontend con acceso a la API del backend bajo `/api` en el mismo origen.

## Módulos

Aún no se han generado módulos de funcionalidades.
