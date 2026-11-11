# Gestión de RR.HH · Frontend

Aplicación Angular 22. Esta estructura inicial incluye el acceso y el layout provistos por la arquitectura, más una página de inicio. Aún no hay módulos funcionales ni endpoints de negocio registrados.

## Requisitos y arranque

Se requiere Node.js compatible con Angular 22 y npm.

```sh
npm install
npm start
```

`npm start` usa la configuración fija de desarrollo con mocks; no requiere levantar el backend. La sesión de demostración usa la contraseña `Demo1234!`.

## Conexión con el backend

El backend está previsto en el puerto `8080`. Para usar la configuración local contra él, ejecuta `npm run start:backend`: el proxy fijo envía `/api` a `http://localhost:8080`. La configuración de producción siempre desactiva los mocks y espera la API bajo `/api` en el mismo origen:

```sh
npm run build
```

El backend aprobado todavía no registra endpoints, incluidos los de sesión. Por ello, el acceso real en modo backend o producción depende de que se implementen los endpoints de autenticación esperados por los archivos fijos de sesión. No se consumen servicios de negocio en esta estructura inicial.

La base de datos Firestore pertenece a otra capa y no se conecta directamente al frontend. Sus emuladores usan los puertos `8085` y `4005`; el backend es responsable de acceder a ella.

## Módulos

Todavía no hay módulos funcionales. Se incorporarán a la navegación y al ruteo cuando estén generados.
