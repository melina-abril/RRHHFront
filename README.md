# Gestión de RR.HH

Aplicación Angular para la gestión interna de Recursos Humanos de TECHFORB.

## Desarrollo con datos de demostración

```sh
npm install
npm start
```

Abre la dirección que muestra Angular. En modo demostración puedes ingresar con cualquier correo válido y la contraseña `Demo1234!`. No necesitas iniciar Firebase ni el backend.

## Desarrollo conectado al backend

En el repositorio del backend, inicia los emuladores con `npm start` y carga los datos de ejemplo con `npm run seed:emulator`. Después, en este repositorio, ejecuta `npm run start:backend`. Esta configuración usa el emulador de Firebase Auth y el proxy `/api` hacia la función del backend. Usa el usuario de ejemplo cargado por el seed y la contraseña `Demo1234!`.

Para conectar un proyecto Firebase real, completa `environment.firebase` con la configuración web obtenida en la consola de Firebase y configura el entorno de despliegue para usar la API real y `useMock: false`. La compilación predeterminada conserva el entorno de demostración; no la despliegues como conexión real sin configurar ese reemplazo. Los archivos de configuración y arranque existentes pertenecen a la arquitectura y no se modifican aquí.

## Módulos

- Pantalla principal (`/dashboard`).
- Gestión de empleados (`/employees`): listado, ficha y alta de colaboradores.

El inicio y cierre de sesión y la protección de las rutas están implementados en los componentes compartidos de la arquitectura.
