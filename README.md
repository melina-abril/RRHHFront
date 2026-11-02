# Gestión de RR.HH – Frontend

## ¿Qué es?
Aplicación web interna de Recursos Humanos para TECHFORB (MVP). Integra gestión de empleados, sueldos y bonos, solicitudes y el resto de módulos para administración RR.HH.

## Levantar la app en local

1. Instala las dependencias:

   ```sh
   npm install
   ```

2. Arranca en modo demo (sin backend, con datos de ejemplo y login ficticio):

   ```sh
   npm start
   ```
   - Puedes entrar con cualquier correo y la contraseña de demo:
     **Demo1234!**

3. Para integrar con el backend real (emuladores Firebase Functions + Auth):

   - Levanta el backend siguiendo el README de su repo con:
     ```sh
     npm start
     npm run seed:emulator
     ```
   - Levanta el frontend con:
     ```sh
     npm run start:backend
     ```
   - El login conecta contra el emulador de Auth y la API admin de RR.HH.
   - Usuario:
     - Correo: admin@techforb.com.ar (o el que figure en el seed del backend)
     - Contraseña: **Demo1234!**

## Configuración para producción
- Reemplaza `environment.firebase` en `src/environments/environment.ts` y `.backend.ts` por la configuración web del proyecto real de Firebase (consola de Firebase → Configuración → Tus apps).
- En producción (`ng build` o `npm run build`) se usa la configuración de `environment.backend.ts`.

## Lista de módulos
- **Inicio de sesión:** acceso restringido al admin de RR.HH.
- **Pantalla principal (Inicio):** entrada a todos los módulos y resumen de situación.
- **Gestión de Empleados:** colaboradores, fichas individuales, altas y estados históricamente.

El sistema crecerá con los siguientes módulos:
- Sueldos y Bonos
- Solicitudes
- Comunicados
- Horas Extras

---

- Estilo propio de TECHFORB (violetas, fondos claros, tipografía Inter).
- Responsive y accesible según la guía del sistema.
- El login y la sesión se manejan con Firebase Auth (ID token); no modifiques los archivos de `core/session`.
