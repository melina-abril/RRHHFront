# Gestión de RR.HH · Frontend

Aplicación Angular 22 para la gestión interna de Recursos Humanos.

## Desarrollo

Requiere una versión de Node.js compatible con Angular 22. Ejecuta `npm install` y `npm start` para abrir la aplicación en `http://localhost:4200` con datos de demostración, sin backend. Para probar la sesión de demostración, usa un correo y la contraseña `Demo1234!`.

Para conectarte al backend local, inicia primero su API en `http://localhost:8080` y ejecuta `npm run start:backend`. El proxy de desarrollo envía las peticiones `/api` a ese puerto. El backend debe permitir el origen `FRONT_URL=http://localhost:4200`. La sesión utiliza `POST /api/auth/login`, `GET /api/auth/me` y `POST /api/auth/logout`; las peticiones de los módulos usan sus endpoints bajo `/api`.

`npm run build` genera siempre la versión de producción con `useMock: false`. Su configuración llama a `/api` en el mismo origen; configura el servidor de despliegue para dirigir ese prefijo al backend. El frontend no se conecta directamente a Firestore: el backend accede a la base, cuyo emulador de desarrollo escucha en `127.0.0.1:8085`.

## Módulos

- **Colaboradores** (`/employees`): listado, ficha individual, alta y edición.
- **Pantalla principal** (`/dashboard`): indicadores y próximos eventos.
- **Inicio de sesión** (`/login`): acceso a los módulos internos; su ruta pertenece a la sesión compartida y no aparece en el menú.

Los módulos internos requieren una sesión con el rol `ADMIN`.
