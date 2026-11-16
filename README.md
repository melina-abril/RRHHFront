# Gestión de RR.HH · Frontend

Aplicación Angular 22 para la administración de Recursos Humanos.

## Arranque

Requiere Node.js y npm. Ejecuta `npm install` y `npm start` para abrir la aplicación en `http://localhost:4200` con datos de demostración. En este modo, la contraseña de demostración es `Demo1234!`.

Para utilizar el backend local, inícialo en el puerto `8080` y ejecuta `npm run start:backend`. La configuración de desarrollo usa el proxy de `/api` hacia ese puerto. `npm run build` genera siempre una aplicación conectada al backend: la configuración de producción usa `/api` en el mismo origen, sin mocks. Si se despliegan por separado, configura el servidor web para dirigir `/api` al backend.

## Módulos

- Colaboradores (`/employees`): listado, alta y ficha de colaboradores.
- Pantalla principal (`/dashboard`): indicadores y próximos eventos.
- Inicio de sesión (`/login`): pantalla pública, fuera de la navegación administrativa.

## Conexión con las otras capas

El frontend consume la API del backend bajo `/api`, en el puerto local `8080`; el backend permite el origen `http://localhost:4200` mediante `FRONT_URL`. La sesión usa `POST /api/auth/login`, `GET /api/auth/me` y `POST /api/auth/logout`. El módulo de colaboradores consume `GET /api/employees`, `GET /api/employees/:id` y `POST /api/employees`; la pantalla principal consume `GET /api/dashboard/summary`. El frontend no se conecta directamente a Firestore: el backend se encarga de acceder a su emulador local en `127.0.0.1:8085`.
