# Gestión de RR.HH — Frontend Angular

Aplicación web para la gestión interna de Recursos Humanos de TECHFORB.

## Cómo levantar el proyecto

1. **Instala las dependencias:**

   ```sh
   npm install
   ```

2. **Modo demostración (sin backend, Mocks):**

   Levanta la aplicación con mocks locales y autenticación de demostración:

   ```sh
   npm start
   ```

   - Puedes iniciar sesión con cualquier correo y la contraseña:

     **Demo1234!**

   - Los datos y la navegación se muestran con información de ejemplo.

3. **Contra el backend en emuladores Firebase:**

   Ejecuta el backend siguiendo su README (debe estar corriendo en modo emulador). Luego levanta el frontend apuntando al backend y al emulador de Auth:

   ```sh
   npm run start:backend
   ```

   - Inicia sesión con el usuario cargado por el backend (ver su README, suele ser el correo demo con la contraseña **Demo1234!**).
   - Las APIs consultan el backend. El login accede al emulador de Firebase Auth local.

4. **Ambiente real (Firebase + API real):**

   - Completa la configuración web de Firebase en `src/environments/environment.ts` y, si corresponde, en `src/environments/environment.backend.ts`:

     ```ts
     firebase: {
       apiKey: 'TU_API_KEY',
       authDomain: 'TU_DOMINIO.firebaseapp.com',
       projectId: 'TU_PROJECT_ID',
       appId: 'TU_APP_ID',
     }
     ```
   - Asegúrate de que `apiBaseUrl` y `authEmulatorUrl` estén configurados según el entorno de despliegue.

5. **Build de producción:**

   ```sh
   npm run build
   ```

   El resultado queda en `dist/`.

---

## Módulos

- **Pantalla principal**: "dashboard". Acceso principal, indicadores e ingreso a los distintos módulos.
- **Gestión de Empleados**: "employees". Alta, consulta y administración general de colaboradores.

El acceso requiere una cuenta administrativa y estar autenticado. El login y control de sesión ya están implementados.

---

> Consulta la documentación en línea y el backend para detalles adicionales de setup o emulación.
