# Gestión de RR.HH — Frontend

Esta aplicación es el frontend de **Gestión de Recursos Humanos TECHFORB**. Permite a Recursos Humanos centralizar la gestión de colaboradores, solicitudes, comunicados, horas extras, remuneraciones y otros procesos.

## ¿Cómo levantarla?

1. Instala dependencias:

   ```
   npm install
   ```

2. Inicia la app en modo desarrollo (mock, sin backend):

   ```
   npm start
   ```

   Accede a [http://localhost:4200](http://localhost:4200)

3. Para conectar con el backend, ajusta `src/environments/environment.ts`:

   - Cambia `useMock` a `false`.
   - El backend debe estar disponible en `/api` (proxy).

## Estructura de carpetas

- `src/app/core` — Sesión, layout, autenticación y servicios base.
- `src/app/features` — Un módulo por funcionalidad:
  - `auth` — Inicio de sesión
  - `inicio` — Pantalla principal
- `src/app/shared` — Componentes, modelos y pipes reutilizables
- `src/environments` — Configuración de entorno (API y modo mock)
- `src/styles.scss` — Variables y estilos globales según la marca TECHFORB

## Modo mock

Por defecto la app anda con datos simulados. Si necesitas probar contra APIs reales, cambia el flag `useMock: false`.

## Navegación

- Solo el usuario de RR.HH autorizado accede mediante login.
- Cada módulo aparece en el menú lateral tras iniciar sesión.

---

TECHFORB · Gestión de Recursos Humanos