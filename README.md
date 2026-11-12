# Gestión de RR.HH · Frontend

Aplicación Angular 22 para la administración de Recursos Humanos de TECHFORB.

## Desarrollo

Requiere Node.js compatible con Angular 22. Ejecuta `npm install` y `npm start` para abrir la aplicación en `http://localhost:4200` con datos de demostración. Para utilizar el backend local, levántalo en `http://localhost:8080` y ejecuta `npm run start:backend`. Esta configuración usa el proxy existente para dirigir `/api` al backend; no conecta el navegador directamente con Firestore.

`npm run build` genera la versión de producción con `useMock: false`. En producción, sirve el frontend junto a la API en el mismo origen bajo `/api`, o configura un proxy equivalente.

## Módulos

- Inicio de sesión: `/login`, gestionado por la sesión compartida.
- Pantalla principal: `/dashboard`; consulta `GET /api/dashboard/summary`.
- Empleados: `/employees`; consulta `GET /api/employees`, `GET /api/employees/:id` y registra altas con `POST /api/employees`.

La sesión utiliza `POST /api/auth/login`, `GET /api/auth/me` y `POST /api/auth/logout`. El backend autoriza el origen del frontend con `FRONT_URL=http://localhost:4200`; su API escucha en el puerto `8080` y se conecta al emulador de Firestore en `127.0.0.1:8085`. El frontend no necesita credenciales ni variables de conexión a la base de datos. Para probar el inicio de sesión real, primero debe aprovisionarse una cuenta administradora en el backend.
