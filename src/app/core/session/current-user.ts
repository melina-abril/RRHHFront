import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, firstValueFrom, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_ROLES } from '../../app.navigation';
import { apiUrl } from '../http/api-url';
import { mockError, mockResponse } from '../http/mock-response';

/** Usuario de la sesión: misma forma que SessionUserResponse del backend (POST /auth/login y GET /auth/me). */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  /** Código del rol (AppRole.value); null si el sistema no define roles. */
  role: string | null;
}

/** Contraseña de los usuarios de ejemplo: la misma que trae el seed de la base. En modo mock vale para cualquier correo. */
export const DEMO_PASSWORD = 'Demo1234!';

/**
 * Sesión del usuario. Con backend: cookie HttpOnly que pone POST /auth/login y que el navegador manda sola
 * (mismo origen por el proxy); load() la recupera al abrir la app con GET /auth/me. En modo mock: login de
 * demostración con el rol que se elige en el encabezado ("Ver como").
 */
@Injectable({ providedIn: 'root' })
export class CurrentUser {
  private readonly http = inject(HttpClient);
  private readonly state = signal<SessionUser | null>(null);

  readonly user = this.state.asReadonly();
  readonly isAuthenticated = computed(() => this.state() !== null);
  readonly roleLabel = computed(() => APP_ROLES.find((role) => role.value === this.state()?.role)?.label ?? '');

  /** true si el usuario tiene alguno de los roles (o si la lista está vacía). */
  hasRole(roles: readonly string[] | undefined): boolean {
    if (!roles?.length) return true;
    const role = this.state()?.role ?? null;
    return role !== null && roles.includes(role);
  }

  /** Recupera la sesión al abrir la app (provideAppInitializer). Sin sesión válida queda en null y se ve el login. */
  load(): Promise<void> {
    if (environment.useMock) return Promise.resolve();
    return firstValueFrom(
      this.http.get<SessionUser>(apiUrl('/auth/me')).pipe(
        tap((user) => this.state.set(user)),
        map(() => undefined),
        catchError(() => {
          this.state.set(null);
          return of(undefined);
        }),
      ),
    );
  }

  login(email: string, password: string): Observable<SessionUser> {
    const request = environment.useMock ? this.mockLogin(email, password) : this.http.post<SessionUser>(apiUrl('/auth/login'), { email, password });
    return request.pipe(tap((user) => this.state.set(user)));
  }

  logout(): Observable<void> {
    const request = environment.useMock ? mockResponse(undefined) : this.http.post<void>(apiUrl('/auth/logout'), {});
    return request.pipe(
      catchError(() => of(undefined)),
      tap(() => this.state.set(null)),
    );
  }

  /** La sesión venció (401 de la API): se olvida el usuario y la app vuelve al login. */
  clear(): void {
    this.state.set(null);
  }

  /** Solo en modo mock: cambia el rol del usuario de demostración ("Ver como" del encabezado). */
  setRole(value: string): void {
    const role = APP_ROLES.find((option) => option.value === value);
    const current = this.state();
    if (role && current) this.state.set({ ...current, name: role.userName, role: role.value });
  }

  private mockLogin(email: string, password: string): Observable<SessionUser> {
    if (password !== DEMO_PASSWORD) return mockError(401, 'El correo o la contraseña no son correctos.');
    const first = APP_ROLES[0];
    return mockResponse({ id: 'demo', name: first?.userName ?? 'Usuario de prueba', email, role: first?.value ?? null });
  }
}
