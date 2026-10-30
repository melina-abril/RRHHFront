# Sistema de Gestión de RR.HH — Frontend

Este es el frontend Angular 21 standalone del sistema de Gestión de Recursos Humanos de TECHFORB.

## Instalación y arranque

1. Instala dependencias:
   
   ```
   npm install
   ```

2. Arranca el proyecto:
   
   ```
   npm start
   ```

   Esto lo ejecuta en modo desarrollo (`ng serve`).

3. Acceso:
   Abre http://localhost:4200 en tu navegador.

## Conexión backend/mock

- Por defecto (`src/environments/environment.ts`), `useMock` es `true`.
- La aplicación está lista para funcionar **sin backend**: todos los servicios de datos devuelven mocks realistas.
- Para conectar al backend Java Spring, pon `useMock: false` y asegurate que la API corra en http://localhost:8080 (ajusta `apiBaseUrl` de ser necesario).

## Estructura

- `src/app/core/`: piezas únicas de la app (autenticación, layout, http).
- `src/app/features/`: un módulo funcional por carpeta (ej. `employee-list`, `employee-profile`, etc.).
- `src/app/shared/`: componentes y tipos reutilizables.
- `src/environments/`: configuración de entorno.
- Estilos en `src/styles.scss` usando variables CSS de la paleta corporativa.

## Comandos útiles

- `npm start` — Levanta la app en http://localhost:4200
- `npm run build` — Genera build estática de producción en `dist/`

## Notas

- El login está habilitado para usuarios de TECHFORB (`@techforb.com`), pero en mock acepta cualquier correo válido de ese dominio.
- Los componentes y servicios de cada funcionalidad están bajo `src/app/features/{modulo}`.
- Para rutas, lazy-loading y estilo visual, sigue las buenas prácticas y convenciones del proyecto.
