// Modelos del módulo auth, formatos según el contrato backend

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SesionResponse {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  organizacionId: string;
}
