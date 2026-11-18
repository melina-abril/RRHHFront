# Gestión de RR.HH

Interfaz Angular para RH smart. Esta estructura inicial incluye la sesión, la navegación vacía y una página de bienvenida; todavía no hay módulos de funcionalidades.

## Desarrollo

Requiere Node.js compatible con Angular 22 y npm.

```sh
npm install
npm start
```

Abre `http://localhost:4200`. Este modo utiliza la sesión de demostración: ingresa un correo y la contraseña `Demo1234!`. Para usar el backend local, inicia primero el backend en el puerto `8080` y ejecuta:

```sh
npm run start:backend
```

El proxy envía `/api` al backend. El backend debe permitir el origen `http://localhost:4200` mediante `FRONT_URL`. La sesión consume `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`; no se consumen otros servicios hasta que se incorporen módulos.

`npm run build` genera la versión de producción con `useMock: false` y la API en el mismo origen bajo `/api`. Configura el servidor de despliegue para reenviar ese prefijo al backend.

## Módulos

Aún no se han incorporado módulos de funcionalidades.
