# Gestión de RR.HH

Aplicación interna de Recursos Humanos para TECHFORB, desarrollada con Angular 22.

## Desarrollo

Requiere Node.js y npm. Ejecuta `npm install` y `npm start` para abrir la aplicación en `http://localhost:4200` con datos de demostración, sin necesidad de iniciar el backend. En modo demostración, la contraseña de acceso es `Demo1234!`.

Para usar datos reales, inicia el backend por separado en el puerto `8080` y ejecuta `npm run start:backend`. El proxy de desarrollo dirige `/api` a `http://localhost:8080`. El backend permite el origen del frontend mediante `FRONT_URL=http://localhost:4200`. Para consultar datos persistidos, el backend necesita conectarse a Firestore; en desarrollo puede usar `FIREBASE_PROJECT_ID=demo-app` y `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. Consulta las instrucciones del repositorio de la base de datos para iniciar el emulador y cargar sus datos de ejemplo.

`npm run build` genera la versión de producción **siempre conectada al backend**, sin mocks. La API debe estar disponible en el mismo origen bajo `/api`; configura el servidor que aloje el frontend para dirigir ese prefijo al backend.

## Módulos

- Inicio (`/dashboard`): indicador disponible de colaboradores activos.
- Gestión de Empleados (`/employees`): listado, ficha y alta de colaboradores.
- Inicio de sesión (`/login`): pantalla pública, fuera de la navegación interna.

La sesión utiliza `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`. Inicio consume `GET /api/dashboard`; Gestión de Empleados consume `GET /api/employees`, `GET /api/employees/:id` y `POST /api/employees`. El acceso a las pantallas internas requiere una sesión con rol `ADMIN`.
