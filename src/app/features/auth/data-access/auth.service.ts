import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { mockResponse } from 'src/app/core/http/mock-response';
import { LoginRequest, LoginResponse } from '../models/auth.models';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthFeatureService {
  private http = inject(HttpClient);

  /**
   * Login: valida credenciales y devuelve los datos de sesión.
   * Backend: POST /api/auth/login
   */
  public login(payload: LoginRequest): Observable<LoginResponse> {
    if (environment.useMock) {
      // MOCK: Acepta solo rh@techforb.com / demo123
      if (
        payload.email.toLowerCase() === 'rh@techforb.com' &&
        payload.password === 'demo123'
      ) {
        // Dummy: respuesta equivalente al backend
        return mockResponse({
          id: 'f0fac4c1-63b9-47cd-8e99-f87e019aac9f',
          nombre: 'RH ADMIN',
          email: 'rh@techforb.com',
          rol: 'ADMIN_RRHH',
          organizacionId: 'techforb-org-uuid'
        });
      } else {
        // Dummy: respuesta de error
        return throwError(() => ({
          message:
            'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.'
        }));
      }
    }
    return this.http.post<LoginResponse>(
      '/api/auth/login',
      payload,
      { withCredentials: true }
    ).pipe(
      map(response => response),
      catchError(error => {
        // Devuelve mensaje de error legible
        return throwError(() => ({
          message:
            error?.error?.message ||
            'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.'
        }));
      })
    );
  }

  /**
   * Logout: cierra la sesión autenticada.
   * Backend: POST /api/auth/logout
   */
  public logout(): Observable<void> {
    if (environment.useMock) {
      // MOCK: simplemente resuelve
      return mockResponse(undefined);
    }
    return this.http.post<void>('/api/auth/logout', {}, { withCredentials: true });
  }

  /**
   * Obtiene la información de la sesión actual.
   * Backend: GET /api/auth/me
   */
  public getCurrentSession(): Observable<LoginResponse> {
    if (environment.useMock) {
      // MOCK: sólo existe sesión para rh@techforb.com
      return mockResponse({
        id: 'f0fac4c1-63b9-47cd-8e99-f87e019aac9f',
        nombre: 'RH ADMIN',
        email: 'rh@techforb.com',
        rol: 'ADMIN_RRHH',
        organizacionId: 'techforb-org-uuid'
      });
    }
    return this.http.get<LoginResponse>('/api/auth/me', { withCredentials: true });
  }
}
