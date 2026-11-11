# Gestión de RR.HH · Frontend

Aplicación Angular 22. Requiere Node.js compatible con Angular 22 y npm.

## Desarrollo

```sh
npm install
npm start
```

`npm start` levanta la aplicación en `http://localhost:4200` con la configuración de desarrollo y el modo mock. Para conectarla al backend local:

```sh
npm run start:backend
```

El proxy envía `/api` a `http://localhost:8080`. El backend debe permitir el origen `http://localhost:4200` mediante `FRONT_URL`. La sesión utiliza `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`; el backend también expone `GET /api/health`. El frontend no accede directamente a Firestore: el backend se conecta a la base, cuyo emulador de desarrollo escucha en `127.0.0.1:8085`.

## Compilación

```sh
npm run build
```

La compilación utiliza siempre `environment.production.ts`, sin mocks y con la API en el mismo origen bajo `/api`. Al desplegar, configura el servidor para dirigir ese prefijo al backend.

## Módulos

Todavía no se han incorporado módulos funcionales. La aplicación muestra una página de inicio tras acceder con la sesión provista por la arquitectura.
