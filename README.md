# Sistema de Gestión de RR.HH (TECHFORB)

Aplicación web interna de Recursos Humanos para TECHFORB, implementada en Angular 21 con arquitectura modular, sin zone.js y componentes standalone.

## Levantar la aplicación

```sh
npm install
npm start
```

- Desarrollo: UI completa, conecta al backend Java Spring Boot en http://localhost:8080 vía proxy (todas las requests a `/api` son enviadas al backend; las URLs se construyen con `apiUrl(path)`).
- Producción: `ng build` genera el build y se conecta al backend de ejemplo (`https://api-rrhh.techforb.com`).
- El modo mock (sin backend) puede activarse poniendo `useMock: true` en `src/environments/environment.ts`. En este modo los datos son locales y no se requiere backend ni proxy.

## Estructura de carpetas

- `src/app/core/auth/` — Inicio/cierre de sesión, guard y pantalla de login (protegido todo salvo `/login` y formulario público).
- `src/app/core/layout/` — Encabezado, navegación superior y layout principal de la app.
- `src/app/features/` — Un módulo por funcionalidad. Ejemplo: `colaboradores/` para gestión de empleados con listado, alta, edición y ficha.
- `src/app/shared/` — Componentes, pipes y modelos reutilizables, para tablas, filtros, estados de carga, etc.

## Variables de entorno y configuración

- `src/environments/environment.ts`
  - `apiBaseUrl`: (string) Prefijo de URL de la API. En desarrollo es vacío (`''`) porque el proxy lo resuelve.
  - `useMock`: (boolean) Para usar datos mock sin backend.
- Proxy de desarrollo en `proxy.conf.json` (desarrollo, no producción):
  - Todos los requests a `/api` van a `http://localhost:8080`.

## Comandos útiles

- `npm install` — Instala dependencias
- `npm start` — Levanta el servidor de desarrollo (`ng serve`)
- `npm run build` — Build de producción

## Convenciones

- Angular 21, standalone, sin zone.js, rutas como loadChildren/lazy loading, tipado estricto.
- Estado/reactividad con signals, imports relativos.
- Todos los componentes y páginas usan las variables y reglas de estilo en `src/styles.scss`. No usar Angular Material, Bootstrap, ni UI externas.

## Módulos implementados

- **Inicio:** Tablero principal con indicadores e ingreso a otros módulos.
- **Colaboradores:** Gestión de empleados (listado, alta, ficha, edición, egreso, reingreso).
- *(El menú muestra solo los módulos ya desarrollados. Próximos módulos: Sueldos y Bonos, Solicitudes, Comunicados, Horas Extras.)*

Para más detalles, ver los archivos en cada carpeta.
