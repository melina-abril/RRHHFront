/** Rol de prueba que se puede elegir en el encabezado (cada sistema define los suyos en app.navigation.ts). */
export interface AppRole {
  /** Código del rol, el mismo que usa el backend (ej. 'SELLER'). */
  value: string;
  /** Texto visible (ej. 'Vendedor'). */
  label: string;
  /** Nombre del usuario de prueba con ese rol. */
  userName: string;
}

/** Link de la navegación lateral: uno por módulo. */
export interface NavigationItem {
  /** Ruta del módulo en app.routes.ts, sin barra inicial (ej. 'products'). */
  path: string;
  label: string;
  /** Roles que ven el link; sin roles lo ve cualquiera. Proteger también la ruta con roleGuard. */
  roles?: readonly string[];
}
