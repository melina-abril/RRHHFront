# Gestión de RR.HH. — Aplicación Angular

Esta aplicación centraliza y organiza los procesos de Recursos Humanos de TECHFORB, con acceso exclusivo para el área de RR.HH.

## Levantar la aplicación

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Para desarrollo o demo (sin backend):

   ```bash
   npm start
   # (Reinicia la app para cambios)
   ```
   - Acceso: cualquier correo; contraseña Demo1234!
   - Permite simular distintos roles.

3. Para usar con backend local (por el proxy):

   ```bash
   npm run start:backend
   # Levanta la app y reenvía /api al backend Java Spring Boot en http://localhost:8080
   ```
   - La app real lee los módulos y la sesión desde el backend.

4. Build de producción:

   ```bash
   npm run build
   ```

## Módulos incluidos

- **Inicio**: Acceso rápido a los módulos, indicadores de colaboradores, solicitudes pendientes y próximos eventos.
- **Empleados**: Listado, ficha y gestión integral de los colaboradores. Altas, egresos, reingresos y edición.

> Los módulos de solicitudes, comunicados y horas extras serán incorporados en próximas etapas.

## Estructura principal

- Layout y sesión: ya resueltos en archivos core/fijos.
- Cada módulo está en `src/app/features/nombre-modulo`.
- Variables de color y estilos: `src/theme.scss` (basado en la identidad TECHFORB).

## Comandos principales

- `npm install` — Instala dependencias
- `npm start` — Dev sería, mocks (sin backend)
- `npm run start:backend` — Con backend real en http://localhost:8080 (vía proxy)
- `npm run build` — Build de producción (reemplaza variables de entorno)

---

© TECHFORB — Gestión de RR.HH.
