# Gestión de RR.HH · Frontend

Aplicación Angular 22 para la gestión interna de Recursos Humanos de TECHFORB.

## Desarrollo

Requiere Node.js compatible con Angular 22. Desde este repositorio:

```sh
npm install
npm start
```

`npm start` inicia la aplicación con datos de ejemplo y sin necesidad de levantar el backend. Para trabajar con la API real, inicia primero el backend en `http://localhost:8080` y ejecuta:

```sh
npm run start:backend
```

La aplicación se abre en `http://localhost:4200`. El proxy de desarrollo dirige las solicitudes `/api` al backend en el puerto `8080`; la sesión utiliza una cookie HttpOnly. El backend debe permitir este origen mediante `FRONT_URL=http://localhost:4200`. La aplicación no se conecta directamente a Firestore: el backend accede a la base o a su emulador en `127.0.0.1:8085`.

## Compilación y despliegue

```sh
npm run build
```

La compilación de producción utiliza `src/environments/environment.production.ts`: desactiva los mocks y llama a la API bajo `/api` en el mismo origen. Configura el servidor de despliegue para dirigir ese prefijo al backend y servir la aplicación Angular para las rutas de navegación.

## Módulos

- **Pantalla principal:** indicadores desde `GET /api/dashboard/summary`.
- **Gestión de empleados:** listado, ficha y alta mediante `GET /api/employees`, `GET /api/employees/:id` y `POST /api/employees`.

El inicio de sesión y el cierre de sesión están resueltos por los archivos fijos de sesión; utilizan `POST /api/auth/login`, `POST /api/auth/logout` y `GET /api/auth/me`. Los módulos internos requieren una sesión con rol `ADMIN`.
