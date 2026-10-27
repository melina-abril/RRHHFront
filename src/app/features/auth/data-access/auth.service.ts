// Servicio de datos: login, logout, sesión actual

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { of, throwError, Observable } from 'rxjs';
import { delay, tap, map, catchError } from 'rxjs/operators';
import { MOCK_SESSION } from './auth.mock';
import { LoginRequest, SesionResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  // Signal del usuario actual
  public session = signal<SesionResponse | null>(null);

  constructor(private http: HttpClient) {}

  /** Login: POST /api/auth/login */
  login(request: LoginRequest): Observable<SesionResponse> {
    if (environment.useMock) {
      // MOCK: solo email=\'rh@techforb.com\' y password=\'demo123\' aceptados
      if (
        request.email === 'rh@techforb.com'&&
        request.password === 'demo123'
      ) {
        this.session.set(MOCK_SESSION);
        // mockResponse dummy (se reemplaza al conectar backend)
        return of(MOCK_SESSION).pipe(delay(600));
      } else {
        return throwError(() => ({ message: 'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.' })).pipe(delay(600));
      }
    }
    return this.http.post<SesionResponse>('/api/auth/login', request, { withCredentials: true }).pipe(
      tap(res => this.session.set(res)),
      catchError(error => {
        // el backend responde 401 sin mensaje
        return throwError(() => ({ message: 'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.' }));
      })
    );
  }

  /** Logout: POST /api/auth/logout */
  logout(): Observable<void> {
    if (environment.useMock) {
      this.session.set(null);
      return of(undefined).pipe(delay(300));
    }
    return this.http.post<void>('/api/auth/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.session.set(null))
    );
  }

  /** GET /api/auth/me — devuelve sesión actual validada */
  getCurrentSession(): Observable<SesionResponse> {
    if (environment.useMock) {
      return of(MOCK_SESSION).pipe(delay(300));
    }
    return this.http.get<SesionResponse>('/api/auth/me', { withCredentials: true });
  }
}
