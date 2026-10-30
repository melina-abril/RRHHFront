# Gestión de RR.HH.

Aplicación web interna para centralizar los procesos administrativos de Recursos Humanos de TECHFORB.

## ¿Cómo levantar la aplicación?

1. Instala las dependencias:
   ```
   npm install
   ```

2. Ejecuta en modo demo (mock, sin backend):
   ```
   npm start
   ```
   - Accede con cualquier correo y la contraseña: **Demo1234!**

3. Para usar el backend real (backend Spring Boot corriendo en http://localhost:8080):
   ```
   npm run start:backend
   ```
   - El proxy manda las APIs /api al backend.

4. Para build de producción:
   ```
   npm run build
   ```


## Módulos incluidos

- **Pantalla principal**: Acceso centralizado a los módulos, indicadores y atajos.
- **Gestión de empleados**: Alta, listado, detalle y filtros de colaboradores.

> El inicio de sesión y la sesión de usuario ya están resueltos por el core. La navegación y permisos se resuelven por roles de backend (ADMIN_RRHH).

El resto de los módulos y funcionalidades se sumarán en versiones siguientes.
