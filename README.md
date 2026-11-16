# Gestión de RR.HH · Frontend

Aplicación Angular 22 para la administración interna de Recursos Humanos. Incluye inicio de sesión, pantalla principal y alta y búsqueda de colaboradores. La navegación interna requiere una sesión con el rol `ADMIN`.

## Desarrollo

Requiere una versión de Node.js compatible con Angular 22. Ejecuta `npm install` y `npm start` para iniciar la aplicación en `http://localhost:4200` con datos de demostración, sin backend. En modo demostración, el inicio de sesión acepta un correo y la contraseña `Demo1234!`.

Para usar el backend local, inicia primero la API en el puerto `8080` y ejecuta `npm run start:backend`. Esta configuración desactiva los mocks y utiliza el proxy de desarrollo para enviar `/api` al backend. Ejecuta `npm run build` para generar la versión de producción: siempre desactiva los mocks y consulta `/api` en el mismo origen donde se sirve la aplicación. Configura allí un proxy hacia el backend si lo sirves en otro proceso.

## Módulos

- Inicio de sesión: `/login`, gestionado por la sesión común.
- Pantalla principal: `/dashboard`.
- Alta y búsqueda de colaboradores: `/employees`.

## Conexión con las otras capas

El frontend se comunica únicamente con el backend, no con Firestore. La API escucha en el puerto `8080` y expone sus rutas bajo `/api`; el proxy de desarrollo conserva los métodos, rutas y cookies de sesión de `/api/auth/login`, `/api/auth/logout` y `/api/auth/me`, además de las rutas del panel y los colaboradores. El backend permite el origen del frontend mediante `FRONT_URL=http://localhost:4200`. La base de datos usa Firestore; su emulador local escucha en `127.0.0.1:8085` y es responsabilidad del backend conectarse a él.
