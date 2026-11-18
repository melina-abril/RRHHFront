# Gestión de RR.HH

Frontend Angular para RH smart. Esta estructura inicial incluye el acceso y una página de bienvenida; todavía no hay módulos de funcionalidades.

## Ejecutar

Se requiere Node.js y npm. Ejecuta `npm install` y `npm start` para iniciar la aplicación en `http://localhost:4200` con la sesión de demostración. En ese modo, puedes usar un correo válido y la contraseña `Demo1234!`.

Para conectarte al backend local, inicia primero el backend en el puerto 8080 y ejecuta `npm run start:backend`. El proxy de desarrollo envía `/api` a `http://localhost:8080`. El backend permite el origen `http://localhost:4200` mediante `FRONT_URL` y expone `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` y `GET /api/health`. La sesión usa una cookie HttpOnly; para iniciar sesión contra el backend necesitas una cuenta creada allí. La base Firestore y su emulador, si se usan, se configuran en el repositorio del backend con `FIREBASE_PROJECT_ID` y `FIRESTORE_EMULATOR_HOST`.

`npm run build` genera la versión de producción con `useMock: false`: espera que el backend esté disponible bajo `/api` en el mismo origen. Configura el servidor de despliegue para dirigir ese prefijo al backend.

## Módulos

Aún no se han incorporado módulos de funcionalidades. El inicio de sesión utiliza la sesión compartida de la aplicación.
