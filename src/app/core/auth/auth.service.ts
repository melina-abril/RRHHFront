import { Injectable, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, map, catchError } from 'rxjs/operators';

export interface SessionData {
  nombre: string;
  email: string;
  rol: string;
  organizacion: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Señal del usuario actual (puede ser null si no hay sesión)
  public readonly session = signal<SessionData | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    if (!this.session()) {
      this.loadSession();
    }
  }

  // Login: llama a POST /auth/login con correo corporativo y contraseña
  public login(email: string, password: string): Observable<void> {
    if (environment.useMock) {
      // MOCK: acepta cualquier correo @techforb.com y cualquier contraseña
      if (email && /@techforb\.com$/i.test(email)) {
        const data: SessionData = {
          nombre: 'Administrador RR.HH',
          email,
          rol: 'ADMIN',
          organizacion: 'TECHFORB'
        };
        this.session.set(data);
        // Simula delay de red (remplazar al conectar el backend)
        return of(undefined).pipe(delay(600));
      } else {
        return throwError(() => ({ message: 'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.' })).pipe(delay(600));
      }
    }
    return this.http.post<SessionData>('/api/auth/login', { email, password }, { withCredentials: true })
      .pipe(
        tap(data => this.session.set(data)),
        map(() => {}),
        catchError(error => {
          return throwError(() => ({ message: error?.error?.message || 'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.' }));
        })
      );
  }

  // Logout: llama a POST /auth/logout, limpia la sesión y navega a login
  public logout(): Observable<void> {
    if (environment.useMock) {
      this.session.set(null);
      // Simula delay corto (remplazar al conectar backend)
      return of(undefined).pipe(
        delay(300),
        tap(() => this.router.navigateByUrl('/login'))
      );
    }
    return this.http.post<void>('/api/auth/logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.session.set(null);
        this.router.navigateByUrl('/login');
      })
    );
  }

  // Cargar la sesión actual (GET /auth/me)
  public loadSession(): void {
    if (environment.useMock) {
      // MOCK: persiste la sesión en memoria (remplazar al conectar backend)
      // Si ya hay sesión, no hace nada.
      if (!this.session()) {
        this.session.set(null);
      }
      return;
    }
    this.http.get<SessionData>('/api/auth/me', { withCredentials: true })
      .pipe(
        tap(data => this.session.set(data)),
        catchError(() => {
          this.session.set(null);
          return of(undefined);
        })
      ).subscribe();
  }

  // Devuelve true si hay usuario autenticado
  public isAuthenticated(): boolean {
    return !!this.session();
  }
}
