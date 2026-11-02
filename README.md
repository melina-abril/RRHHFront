# Gestión de RR.HH — Frontend

Aplicación web Angular 22 para el sistema de Gestión de Recursos Humanos de TECHFORB.

## Levantar la app

1. Instala las dependencias:

```bash
npm install
```

2. Desarrollo con datos de ejemplo (mocks y login de demostración):

```bash
npm start
```

- Accede con cualquier correo y la contraseña de ejemplo: **Demo1234!**
- Puedes cambiar de rol desde la esquina superior derecha ("Ver como").

3. Conexión al backend real en emuladores locales:

- Levanta los emuladores en el backend (ver instrucciones en su repo):
  - Ejecuta `npm start` y luego `npm run seed:emulator` en la carpeta del backend para inicializar datos y usuarios de prueba.
- En el frontend, ejecuta:

```bash
npm run start:backend
```

- Esto usa la configuración del emulador (login contra Firebase Auth local y API por proxy a Functions).
- Usuario de muestra: _mariana.rrhh@techforb.com_ · **Demo1234!** _(la contraseña es la misma de la demo)_


## Deploy y conexión con tu proyecto Firebase

1. Agrega la configuración web de tu proyecto de Firebase en `src/environments/environment.ts` y `src/environments/environment.backend.ts`:

```ts
firebase: {
  apiKey: '…',
  authDomain: '…',
  projectId: '…',
  appId: '…'
}
```

Obtén estos valores desde la consola de Firebase → Configuración 

2. Para producción, compila la app con:

```bash
npm run build
```

Consulta la documentación para deploy en Firebase Hosting o tu servidor.

## Estructura y módulos

- La navegación y los módulos disponibles dependen del rol; actualmente solo hay cuenta Administrador de RR.HH.
- Módulos incluidos:
  - **Inicio**: indicadores y accesos a otros módulos
  - **Empleados**: listado, detalle y gestión de colaboradores


## Scripts útiles

- `npm start`          — Levanta la app con mocks (sin backend)
- `npm run start:backend` — Modo conectado a backend de emuladores (`npm start` y `npm run seed:emulator` en el backend primero)
- `npm run build`      — Compilar app para producción

## Notas

- No edites los archivos de la carpeta `core/session` salvo extrema necesidad: el login, guard, interceptor y sesión están preimplementados para login con Firebase Auth y el backend Node.
- Revisa el repo del backend para ejecutar los emuladores y cargar los usuarios demo.
- El frontend utiliza la arquitectura Angular signals, sin NgModule ni zone.js, y es estrictamente tipado.
