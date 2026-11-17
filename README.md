# Gestión de RR.HH. · Frontend

Aplicación Angular 22 para la gestión interna de Recursos Humanos.

## Arranque

Requiere Node.js y npm. Ejecuta `npm install` y `npm start` para trabajar con los datos de demostración sin backend. La aplicación estará disponible en `http://localhost:4200`.

Para usar el backend local, arranca primero la API en el puerto `8080` y ejecuta `npm run start:backend`. El proxy de desarrollo dirige las solicitudes `/api` a `http://localhost:8080`. Ejecuta `npm run build` para compilar la aplicación: el build de producción siempre desactiva los mocks y consume `/api` en el mismo origen.

## Módulos

- Listado y edición de colaboradores: `/employees-2`.
- Movimientos laborales: `/employment-movements`.
- Perfil profesional y documentación: `/professional-profiles`.
- Beneficios y saldos: `/benefits`.
- Remuneraciones e historial salarial: `/remunerations`.
- Alta de colaborador: `/employees`.
- Pantalla principal: `/dashboard`.
- Inicio de sesión: `/login`, fuera de la navegación interna.

## Conexión con las otras capas

El backend expone su API bajo `/api` en el puerto `8080`. Para permitir el origen de desarrollo del frontend, configura `FRONT_URL=http://localhost:4200` en el backend. La sesión utiliza `POST /api/auth/login`, `GET /api/auth/me` y `POST /api/auth/logout`; el navegador conserva la cookie de sesión. La base de datos es Cloud Firestore y su emulador de desarrollo escucha en `127.0.0.1:8085`. El frontend no se conecta directamente a Firestore: el backend utiliza `FIREBASE_PROJECT_ID` y `FIRESTORE_EMULATOR_HOST` para acceder a él.
