# Sistema de Gestión de Recursos Humanos (Frontend)

Esta aplicación es el panel administrativo interno para Recursos Humanos de TECHFORB.

## ¿Cómo levantarla?

1. Clona el repositorio y entra a la carpeta.
2. Instala dependencias:

   ```bash
   npm install
   ```

3. Levanta la app en modo desarrollo (mock, sin backend):

   ```bash
   npm start
   ```

   La aplicación quedará visible en http://localhost:4200

4. Para conectarla al backend Java + Spring Boot:

   - Modifica `src/environments/environment.ts` y seteá `useMock: false`.
   - Levanta el backend en http://localhost:8080 (por defecto).
   - Las requests se envían siempre con cookie de sesión.

## Estructura de carpetas

- `src/app/core/`: layout, navegación, sesión y helpers comunes
- `src/app/features/`: un módulo funcional por carpeta (ej: inicio, colaboradores, sueldos)
- `src/app/shared/`: componentes, pipes y modelos reutilizables
- `src/environments/`: configuración por entorno

### Modo mock

En el entorno de desarrollo (`useMock: true`), todos los servicios de datos devuelven respuestas simuladas y la app funciona sin backend conectado.

---

## Scripts

- `npm start`: ambiente de desarrollo (modo mock, hot reload)
- `npm run build`: build de producción
