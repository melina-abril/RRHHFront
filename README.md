# Gestión de RR.HH. · Frontend

Estructura inicial en Angular 22. Aún no hay módulos funcionales; la aplicación incluye una página de inicio y la pantalla de acceso.

## Desarrollo

Requiere Node.js y npm compatibles con Angular 22.

```sh
npm install
npm start
```

`npm start` abre la aplicación en `http://localhost:4200` con el modo demostración habilitado. En ese modo puedes ingresar un correo con la contraseña `Demo1234!`. Todavía no hay módulos en la navegación.

Para usar la sesión del backend local, levanta antes el backend en el puerto 8080 y ejecuta:

```sh
npm run start:backend
```

El proxy de desarrollo envía `/api` a `http://localhost:8080`. El backend expone `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`; el frontend no accede directamente a Firestore. Configura `FRONT_URL=http://localhost:4200` en el backend para permitir el origen del frontend. El backend utiliza el emulador de Firestore de la capa database en `127.0.0.1:8085`; consulta los README de esas capas para iniciarlos y crear la cuenta administradora. Todavía no hay una cuenta real de ejemplo cargada en el backend.

## Compilación

```sh
npm run build
```

La compilación usa `environment.production.ts`: desactiva los mocks y consume la API en el mismo origen bajo `/api`. El servidor que despliegue el frontend debe dirigir ese prefijo al backend. El modo demostración de `npm start` no modifica la configuración de producción.

## Módulos

Ninguno todavía. Las próximas generaciones incorporarán sus rutas y enlaces de navegación.
