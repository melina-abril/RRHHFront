# Sistema de Gestión de Recursos Humanos – Frontend

## Levantar la aplicación

1. Instala dependencias:
   ```
   npm install
   ```

2. Ejecuta en desarrollo con hot reload:
   ```
   npm start
   ```
   Esto levanta la app en http://localhost:4200 con proxy automático a http://localhost:8080 para las requests de /api.

### Entornos y configuración
- El entorno de desarrollo (src/environments/environment.ts) usa `apiBaseUrl: ''` y `useMock: false`, mandando todas las llamadas /api al backend Java/Spring Boot.
- Para desarrollar sin backend, puedes poner `useMock: true` en `src/environments/environment.ts`: todos los servicios del front muestran la app completa usando datos de ejemplo realistas, sin llamada HTTP real.
- El entorno de producción (src/environments/environment.prod.ts) apunta a una URL de ejemplo y nunca usa mocks.

### Build de producción
Compílalo con:
```
npm run build
```
El resultado queda en `dist/rrhh-front`.

## Estructura de carpetas
- `src/app/features/` — Un módulo funcional por carpeta (colaboradores, inicio, etc.)
- `src/app/core/` — Piezas únicas de la aplicación (autenticación, layout)
- `src/app/shared/` — Componentes reutilizables entre módulos
- `src/environments/` — Configuración de entorno
- `src/styles.scss` — Variables CSS, reset, clases compartidas

## Stack
- Angular 21 standalone y zoneless (sin zone.js, sólo signals para el estado)
- No utiliza Angular Material, PrimeNG ni otras librerías UI: los componentes visuales son propios, adaptados de la guía de estilos y variables CSS globales.

## Comandos útiles
- `npm start`: Levanta la app en modo desarrollo
- `npm run build`: Build de producción a `dist/rrhh-front`

## Problemas comunes
- Si la API no responde, revisa que el backend Java esté corriendo en http://localhost:8080.
- Los estilos usan variables CSS de `src/styles.scss` y de la brand de TECHFORB. No modifiques los colores en línea: usa siempre las variables.
- Para ver la app sin backend, pon `useMock: true` en `src/environments/environment.ts`.
