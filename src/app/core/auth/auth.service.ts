import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { mockResponse } from '../http/mock-response';
import { apiUrl } from '../http/api-url';

export interface UsuarioSesion {
  id: number;
  email: string;
  nombre: string;
  rol: 'ADMIN';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Señal de sesión y estado de autenticación
  private readonly _usuario = signal<UsuarioSesion | null>(null);
  readonly usuario = computed(() => this._usuario());
  readonly isAuthenticated = computed(() => !!this._usuario());

  constructor(private readonly http: HttpClient) {
    if (!environment.useMock) {
      this.cargarSesion();
    } else {
      // En modo mock, no hay sesión persistente
      this._usuario.set(null);
    }
  }

  async login(email: string, password: string): Promise<void> {
    if (environment.useMock) {
      // Solo acepta correo corporativo @techforb.com y alguna clave
      if (typeof email !== 'string' || !/^[\w._%+-]+@techforb\.com$/.test(email)) {
        return Promise.reject('unauthorized');
      }
      this._usuario.set({
        id: 1,
        email,
        nombre: 'Administrador RH',
        rol: 'ADMIN'
      });
      return mockResponse(undefined).toPromise();
    }
    // Real: POST /api/auth/login
    return this.http.post(apiUrl('/api/auth/login'), { email, password }, { withCredentials: true }).toPromise()
      .then(() => this.cargarSesion());
  }

  async logout(): Promise<void> {
    if (environment.useMock) {
      this._usuario.set(null);
      return mockResponse(undefined).toPromise();
    }
    return this.http.post(apiUrl('/api/auth/logout'), {}, { withCredentials: true }).toPromise()
      .finally(() => this._usuario.set(null));
  }

  async cargarSesion(): Promise<void> {
    if (environment.useMock) {
      this._usuario.set(null);
      return;
    }
    return this.http.get<UsuarioSesion>(apiUrl('/api/auth/me'), { withCredentials: true }).toPromise()
      .then(
        usuario => this._usuario.set(usuario),
        _err => this._usuario.set(null)
      );
  }
}
