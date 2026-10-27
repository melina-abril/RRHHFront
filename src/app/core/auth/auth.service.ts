import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Reemplazar imports rotos por rutas correctas
import { apiUrl } from '../../core/http/api-url';
import { mockResponse } from '../../core/http/mock-response';

export interface SessionUser {
  id: string;
  email: string;
  nombre: string;
  rol: string;
  organizacionId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionUserSignal = signal<SessionUser | null>(null);
  public sessionUser = computed(() => this.sessionUserSignal());

  constructor(private http: HttpClient) {
    // Cuando cambia el modo (realmente solo en el arranque)
    if (environment.useMock) {
      // Simula sesión iniciada solo si corresponde
      this.sessionUserSignal.set(null);
    } else {
      this.checkSession();
    }
  }

  login(email: string, password: string): Observable<SessionUser> {
    if (environment.useMock) {
      // MOCK: autoriza cualquier correo "@techforb.com" y pass no vacía
      if (typeof email === 'string' && email.trim().toLowerCase().endsWith('@techforb.com') && password && password.length > 0) {
        const session: SessionUser = {
          id: 'e87e4b66-205a-47a4-8b48-cc11e72d9b31',
          email: email.trim().toLowerCase(),
          nombre: 'Administrador RH',
          rol: 'ADMIN_RRHH',
          organizacionId: 'c470cf0d-d878-41ad-8aa3-2d1ac487ab22',
        };
        this.sessionUserSignal.set(session);
        // Devuelve datos como el backend
        return mockResponse(session);
      } else {
        return throwError(() => 'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.');
      }
    } else {
      // Real: POST /auth/login
      return this.http.post<SessionUser>(apiUrl('/auth/login'), { email, password }, { withCredentials: true }).pipe(
        map((session) => {
          this.sessionUserSignal.set(session);
          return session;
        }),
        catchError((err) => {
          // Error: problema de acceso
          return throwError(() => err);
        })
      );
    }
  }

  logout(): Observable<void> {
    if (environment.useMock) {
      this.sessionUserSignal.set(null);
      // MOCK: simula
      return mockResponse(void 0);
    } else {
      return this.http.post<void>(apiUrl('/auth/logout'), null, { withCredentials: true }).pipe(
        map(() => {
          this.sessionUserSignal.set(null);
        })
      );
    }
  }

  checkSession(): void {
    if (environment.useMock) {
      this.sessionUserSignal.set(null);
    } else {
      this.http.get<SessionUser>(apiUrl('/auth/me'), { withCredentials: true })
        .subscribe({
          next: (session) => {
            this.sessionUserSignal.set(session);
          },
          error: () => {
            this.sessionUserSignal.set(null);
          }
        });
    }
  }
}
