# Gestión de RR.HH – Frontend (TECHFORB)

Este proyecto es el frontend de la aplicación Gestión de Recursos Humanos de TECHFORB. Permite al área de RR.HH centralizar la gestión de colaboradores, solicitudes, documentación, sueldos, bonos, horas extras, comunicados y otros procesos internos.

## Levantar la aplicación

1. Instalar dependencias:

   ````sh
   npm install
   ````

2. Ejecutar en modo desarrollo (con datos mock):

   ````sh
   npm start
   ````
   Esto levanta la app en http://localhost:4200 utilizando mocks locales (sin necesitar backend).

3. Conectar con el backend (Java + Spring Boot):

   - Configurar `src/environments/environment.ts` para poner `useMock: false`.
   - Asegurarse que el backend corra en http://localhost:8080 o modificar `proxy.conf.json` según corresponda.

## Estructura principal

- `src/app/core/`   — Autenticación, layout, HTTP comunes.
- `src/app/features/` — Un módulo funcional por carpeta (inicio de sesión, dashboard, etc.).
- `src/app/shared/`  — Componentes, pipes y modelos reutilizables.
- `src/environments/` — Configuración por entorno.

## Requisitos
- Node.js >= 18
- Angular CLI 21

## Ejecución de scripts
- `npm start`  —  Dev server con watch y modo mock por defecto
- `npm run build` — Build de producción

## Proyecto en modo mock
La app inicia por defecto en modo mock y muestra datos simulados compatibles con el backend. Desactivar `useMock` en `environment.ts` para conectar con la API real.
