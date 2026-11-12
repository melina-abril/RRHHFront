# Gestión de RR.HH. · Frontend

Aplicación Angular 22 para TECHFORB. Esta estructura inicial incluye el acceso y una página de inicio; todavía no hay módulos de funcionalidades ni enlaces en la navegación.

## Arranque

Requiere Node.js compatible con Angular 22. Ejecuta `npm install` y `npm start` para abrir la aplicación en `http://localhost:4200` con el modo de demostración. En ese modo, la sesión acepta cualquier correo válido con la contraseña `Demo1234!`.

Para conectar con el backend local, inicia primero la API en el puerto `8080` y ejecuta `npm run start:backend`. El proxy de desarrollo envía `/api` a `http://localhost:8080`. El backend debe permitir el origen `FRONT_URL=http://localhost:4200`. La pantalla de acceso utiliza `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`; el backend también ofrece `GET /api/health`. No hay otros servicios de funcionalidades en esta etapa. Para iniciar sesión contra el backend se necesita una cuenta administradora creada allí; consulta su documentación y la de la base de datos.

`npm run build` genera la versión de producción con `useMock: false`; espera la API en el mismo origen bajo `/api`. Publica el frontend con HTTPS y configura el backend y su sesión para ese origen.

## Módulos

Aún no se han incorporado módulos de funcionalidades. La base de datos Firestore y su emulador en `127.0.0.1:8085` son responsabilidad del backend y de la capa de base de datos; el frontend no se conecta directamente a Firestore.
