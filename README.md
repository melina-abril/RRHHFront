# Gestión de RR.HH – Frontend

Aplicación web interna para administrar colaboradores, legajos, solicitudes, bonos y procesos de Recursos Humanos. Pensada para equipos de RR.HH. de TECHFORB (primera etapa) y expandible a SaaS B2B.

## Arranque rápido

1. Instala dependencias:
   ```
   npm install
   ```
2. Ejecuta en modo desarrollo (se conecta por proxy al backend local Java + Spring):
   ```
   npm start
   ```
   Accede en http://localhost:4200

3. **Configuraciones de entorno:**
   - En desarrollo, consulta al backend en http://localhost:8080 (configurado en proxy.conf.json, NO modifiques apiBaseUrl: el proxy manda /api a backend).
   - Para modo "mock" (sin backend):
     - Cambia `useMock` a `true` en `src/environments/environment.ts`. Todos los datos serán ficticios, pero la app funciona igual.
   - En producción, el build (ng build) usa el backend de ejemplo `https://api-rrhh.techforb.com`.

## Estructura de carpetas principal

- **src/app/core/**: Autenticación, layout y HTTP común
- **src/app/features/**: Un módulo por funcionalidad (ej. inicio, colaboradores)
- **src/app/shared/**: Componentes visuales y modelos compartidos
- **src/app/environments/**: Configuración por entorno
- **src/styles.scss**: Variables de marca y estilos base

## Scripts principales

- `npm start` — Corre en desarrollo en localhost:4200
- `npm run build` — Compila para producción en dist/

## Aclaraciones

- **El package.json es fijo:** No agregues ni quites dependencias. Solo Angular 21 y RxJS.
- **Para compilar en prod:** angular.json reemplaza `environment.ts` por `environment.prod.ts` automáticamente.
- **backend:** No modifiques proxy.conf.json. El backend debe estar en http://localhost:8080, exportando la API con los paths de contrato (`/api/auth/login`, `/api/colaboradores`, ...).
- **Login/mock:** El acceso de ejemplo es cualquier email @techforb.com + clave, mientras useMock esté en true.
- **Frontend:** NO tiene acceso directo a base de datos ni scripts server, solo consume el backend vía HTTP.

## Estructura de módulos y navegación actual

- **Inicio** (pantalla principal, panel, KPIs)
- **Colaboradores** (listado, alta, ficha, edición)

Las funcionalidades "Sueldos y Bonos", "Solicitudes", "Comunicados" y "Horas Extras" estarán disponibles en futuras versiones.

---

Para dudas o problemas, revisar los comentarios en cada archivo principal, los estados de carga y error, y la capa de autenticación (core/auth/).