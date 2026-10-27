export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  organizacionId: string;
}
