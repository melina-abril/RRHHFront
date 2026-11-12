# Gestión de RR.HH · Frontend

Aplicación Angular 22 para la gestión interna de Recursos Humanos de TECHFORB.

## Desarrollo

Requiere Node.js compatible con Angular 22. Desde la raíz de este repositorio:

```sh
npm install
npm start
```

`npm start` abre la aplicación en `http://localhost:4200` con datos de demostración, sin necesidad de iniciar el backend. Para usar la API real, levanta primero el backend en `http://localhost:8080` y ejecuta:

```sh
npm run start:backend
```

Esta configuración dirige `/api` al backend mediante `proxy.conf.json`. El backend debe permitir el origen `http://localhost:4200` mediante `FRONT_URL` y mantener las cookies de sesión. El inicio de sesión utiliza `POST /api/auth/login`, la recuperación de sesión `GET /api/auth/me` y el cierre `POST /api/auth/logout`. Las pantallas consumen `GET /api/dashboard/summary`, `GET /api/employees`, `GET /api/employees/:id` y `POST /api/employees`. El frontend no se conecta directamente a Firestore: el backend gestiona su conexión, que en desarrollo puede usar el emulador en `127.0.0.1:8085`.

```sh
npm run build
```

La compilación de producción utiliza siempre `environment.production.ts`: desactiva los mocks y llama a la API bajo `/api` en el mismo origen. Configura el despliegue para enviar ese prefijo al backend.

## Módulos

- Inicio de sesión: `/login`, fuera de la navegación interna.
- Pantalla principal: `/dashboard`.
- Alta y consulta de colaboradores: `/employees`.

Las rutas internas requieren una sesión con rol `ADMIN`. En modo demostración, la contraseña es `Demo1234!`; para usar la API real es necesario aprovisionar una cuenta administradora en el backend.
