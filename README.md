# Gestión de RR.HH

Interfaz Angular para RH smart. Esta primera estructura incluye el acceso y una página de inicio; todavía no se han generado módulos funcionales.

## Ejecutar

Requiere Node.js y npm. Ejecuta `npm install` y `npm start` para abrir la aplicación en `http://localhost:4200` con la sesión de demostración. Puedes ingresar con cualquier correo válido y la contraseña `Demo1234!`.

Para conectarla al backend, inicia el backend por separado y ejecuta `npm run start:backend`. La configuración fija `proxy.conf.json` apunta a `http://localhost:8080`, mientras que el backend aprobado declara `PORT=3000`: antes de usar este modo, ajusta el destino del proxy local a `http://localhost:3000`. Las peticiones de sesión usan el prefijo `/api`: `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`. El backend debe permitir el origen `http://localhost:4200` mediante `FRONT_URL`. El endpoint de salud disponible es `GET /api/health`.

`npm run build` crea la versión de producción, que siempre utiliza el backend bajo `/api` en el mismo origen y no usa mocks. En producción, configura el servidor web para dirigir `/api` al backend.

La base Firestore se usa únicamente a través del backend; el frontend no se conecta al emulador ni requiere credenciales de la base. El emulador de desarrollo de la base escucha en `127.0.0.1:8085`.

## Módulos

Aún no hay módulos funcionales. Se agregarán a la navegación en las siguientes generaciones.
