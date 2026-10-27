# Gestión de RR.HH - Frontend

Esta aplicación es el frontend del sistema de Gestión de Recursos Humanos de TECHFORB.

## ¿Cómo levantarla?

1. Cloná el repositorio y ubicáte en la carpeta del proyecto.
2. Instalá las dependencias:

   ```
   npm install
   ```
3. Iniciá el servidor de desarrollo:
   ```
   npm start
   ```

- Por defecto, la aplicación levanta en modo mock (useMock: true). Para simular datos reales no es necesario el backend.
- Para conectar con el backend, cambiá el archivo `src/environments/environment.ts` para poner `useMock: false` y asegurate de que el backend corra en http://localhost:8080 (la app usa proxy `/api`).

## Estructura de carpetas

- `src/app/core`: Servicios y layout principal.
- `src/app/features`: Un módulo por funcionalidad importante.
- `src/app/shared`: Componentes y modelos reutilizables.
- `src/environments`: Configuración mock/producción.
- `public/`: Archivos estáticos y favicon.

## Módulos disponibles

- Inicio de sesión (login): acceso de RR.HH.
- Pantalla principal (dashboard): accesos a módulos claves.

Cada módulo nuevo aparecerá en el menú lateral.
