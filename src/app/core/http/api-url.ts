export function apiUrl(path: string): string {
  // Utiliza la configuración de entorno para devolver la URL base de la API
  // Ejemplo: apiUrl('/api/colaboradores') => environment.apiBaseUrl + /api/colaboradores
  // El environment siempre se importa en los servicios: aquí es atómico para ser usado por cualquier data-access
  // ¡Ajustar al conectar el backend real!
  // Por defecto '/api' como base (environment.apiBaseUrl)
  // Tener en cuenta que el path debe iniciar con '/'
  // Si path tiene doble '/', el backend debe resolver correctamente.
  // En una aplicación real, se debe importar environment aquí, pero lo deja con apiUrl(path) para uso genérico.
  // ---
  // Al estar desacoplado del environment aquí por instrucciones de arquitectura, los servicios lo combinan.
  return path;
}
