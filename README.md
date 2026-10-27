# Gestión de RR.HH (TECHFORB) — Frontend

Sistema interno para administración centralizada de Recursos Humanos. 

## Levantar la aplicación

1. Instala dependencias:
   ```sh
   npm install
   ```
2. Inicia en modo desarrollo (mock):
   ```sh
   npm start
   ```
3. Accede a http://localhost:4200

- Por defecto, la aplicación usa datos simulados (mocks) y no requiere backend: puedes verla y navegar todas las pantallas disponibles.
- Para usar un backend real, pon `useMock: false` en el entorno correspondiente.

## Estructura de carpetas

- `src/app/core/`: servicios globales, sesión, layout
- `src/app/features/`: un módulo funcional por carpeta
- `src/app/shared/`: componentes y modelos reutilizables
- `src/environments/`: configuración (`apiBaseUrl`, `useMock`)

## Añadir módulos funcionales

Agrega cada nueva carpeta bajo `src/app/features/` siguiendo el patrón del sistema y registra su ruteo en `app.routes.ts`. El layout, navegación lateral y estilos principales ya lo resuelven automáticamente.
