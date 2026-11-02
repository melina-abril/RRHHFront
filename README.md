# Gestión de RR.HH

Aplicación Angular para la administración de Recursos Humanos.

## Desarrollo con datos de demostración

```sh
npm install
npm start
```

Abre la dirección que indique Angular. En modo demostración puedes iniciar sesión con cualquier correo y la contraseña `Demo1234!`. Los datos de los módulos que disponen de mocks se conservan solo durante la sesión del navegador.

## Desarrollo con el backend

En el repositorio del backend, inicia los emuladores con `npm start` y carga sus datos con `npm run seed:emulator`. Después, en este repositorio:

```sh
npm install
npm run start:backend
```

Esta configuración usa Firebase Auth en `127.0.0.1:9099` y envía `/api` al emulador de Functions mediante `proxy.conf.json`. Consulta el seed del backend para conocer el correo del usuario de ejemplo; su contraseña es `Demo1234!`. Si alguno de los módulos todavía no tiene servicios expuestos por el backend, la conexión no añade esos servicios.

Para conectar un proyecto Firebase real, completa `environment.firebase` con la configuración web de Firebase Console, establece la URL de la API y desactiva `useMock` en la configuración del entorno que se vaya a desplegar. No publiques credenciales privadas en el frontend. El archivo de entorno predeterminado de esta arquitectura mantiene los mocks activos, incluso al ejecutar `npm run build`.

## Módulos

- Edición de colaborador (`employee-editing`).
- Movimientos laborales (`employment-movements`).
- Clientes, proyectos y asignaciones (`project-assignments`).
- Perfil profesional y documentación (`professional-profiles`).
