# Gestión de RR.HH · Frontend

Aplicación Angular 22 para la administración interna de Recursos Humanos de TECHFORB.

## Desarrollo

Requiere Node.js y npm. Desde la raíz de este proyecto:

```sh
npm install
npm start
```

`npm start` levanta la aplicación en `http://localhost:4200` con datos de demostración, sin requerir el backend. Para usar datos reales, inicia el backend en `http://localhost:8080` y ejecuta:

```sh
npm run start:backend
```

Esta configuración desactiva los mocks y envía las solicitudes `/api` al backend mediante `proxy.conf.json`. El backend debe permitir el origen `FRONT_URL=http://localhost:4200`. La sesión utiliza los endpoints `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`, con cookie HttpOnly; para probar el acceso real es necesario aprovisionar una cuenta administradora en el backend. Los colaboradores no tienen acceso al panel.

```sh
npm run build
```

La compilación de producción siempre desactiva los mocks y utiliza la API bajo `/api` en el mismo origen. Al desplegar, configura el servidor para dirigir ese prefijo al backend. La base Firestore y su emulador, disponible en `127.0.0.1:8085` durante el desarrollo del backend, se administran en el repositorio de la base de datos; este frontend nunca se conecta directamente a Firestore.

## Módulos

| Módulo | Ruta | Backend |
|---|---|---|
| Inicio de sesión | `/login` | `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` |
| Pantalla principal | `/dashboard` | `GET /api/dashboard/summary` |
| Alta y búsqueda de colaboradores | `/employees` | `GET /api/employees`, `GET /api/employees/:id`, `POST /api/employees` |

Las rutas internas requieren sesión y el rol `ADMIN`.
