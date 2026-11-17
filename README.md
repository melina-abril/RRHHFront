# Gestión de RR.HH · Frontend

Aplicación Angular 22 para la administración interna de Recursos Humanos.

## Arranque

Requiere Node.js compatible con Angular 22. Ejecuta `npm install` y `npm start` para abrir la aplicación en `http://localhost:4200` con datos de demostración, sin necesidad de iniciar el backend. La contraseña del modo de demostración es `Demo1234!`.

Para usar datos reales, inicia primero el backend en `http://localhost:8080` y ejecuta `npm run start:backend`. El proxy de desarrollo dirige las solicitudes `/api` al backend. `npm run build` genera siempre la versión de producción con `useMock: false`: sirve el frontend y la API bajo el mismo origen, con la API en `/api`.

## Módulos

- Pantalla principal (`/dashboard`).
- Colaboradores (`/employees`).
- Movimientos laborales (`/employment-movements`).
- Perfil profesional y documentación (`/professional-profiles`).
- Beneficios y saldos (`/benefits`).
- Remuneraciones e historial salarial (`/remunerations`).

El inicio de sesión tiene la ruta pública `/login`; no aparece en la navegación. Los módulos administrativos requieren el rol `ADMIN`.

## Conexión con las otras capas

El frontend escucha en el puerto `4200` y consume exclusivamente la API del backend en el puerto `8080`, con el prefijo `/api`. Para desarrollo con backend, configura allí `FRONT_URL=http://localhost:4200` y utiliza `npm run start:backend`. El backend se conecta a Firestore mediante `FIREBASE_PROJECT_ID=demo-app` y, en desarrollo local, `FIRESTORE_EMULATOR_HOST=127.0.0.1:8085`. El frontend no accede directamente a Firestore.
