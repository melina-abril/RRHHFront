# Gestión de RR.HH. · Frontend

Aplicación Angular 22 para el panel interno de Recursos Humanos.

## Desarrollo

Requiere Node.js compatible con Angular 22. Ejecuta `npm install` y `npm start` para iniciar la aplicación en `http://localhost:4200` con datos de demostración. Para usar la API local en lugar de los mocks, inicia primero el backend en el puerto `8080` y ejecuta `npm run start:backend`. La configuración fija de esta modalidad envía las solicitudes `/api` al backend mediante `proxy.conf.json`.

Ejecuta `npm run build` para compilar la versión de producción. Esta versión no usa mocks y espera la API bajo `/api` en el mismo origen; configura un proxy inverso hacia el backend al desplegarla.

## Módulos

- Pantalla principal: `/dashboard`.
- Búsqueda de colaboradores: `/employees`.
- Inicio de sesión: `/login`, provisto por las rutas de sesión; no aparece en el menú.

## Conexión con las otras capas

El frontend consume el backend en el puerto `8080` bajo `/api`. La sesión utiliza `POST /api/auth/login`, `GET /api/auth/me` y `POST /api/auth/logout`; el panel consulta `GET /api/dashboard/summary` y colaboradores consulta `GET /api/employees`. En desarrollo, el origen del frontend es `http://localhost:4200`, el valor que el backend debe permitir mediante `FRONT_URL`. El frontend no se conecta directamente a Firestore ni necesita sus credenciales.
