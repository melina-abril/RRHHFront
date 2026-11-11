# Gestión de RR.HH · Frontend

Estructura inicial de la aplicación Angular 22. Por ahora solo incluye la página de inicio y la sesión proporcionada por la arquitectura; todavía no hay módulos funcionales ni enlaces de navegación.

## Desarrollo

Requiere Node.js y npm.

```sh
npm install
npm start
```

`npm start` usa la configuración de desarrollo con respuestas mock. Para intentar conectarse al backend local:

```sh
npm run start:backend
```

El proxy de desarrollo envía `/api` a `http://localhost:8080`. La sesión incluida en el frontend utiliza `/api/auth/login`, `/api/auth/logout` y `/api/auth/me` al conectarse; el backend aprobado aún no declara endpoints, por lo que el inicio de sesión real depende de que se implementen allí.

```sh
npm run build
```

La compilación de producción siempre desactiva los mocks y usa la API del mismo origen bajo `/api`.

## Integración con las otras capas

El backend se ejecuta en el puerto 8080 y su prefijo informado es `/api/auth`. La base de datos es Cloud Firestore; su emulador local escucha en `127.0.0.1:8085` y el panel en `127.0.0.1:4005`. El frontend se comunica únicamente con el backend, nunca directamente con Firestore. La configuración del emulador y sus variables de entorno pertenecen a los repositorios de backend y base de datos.

## Módulos

Todavía no hay módulos funcionales registrados.
