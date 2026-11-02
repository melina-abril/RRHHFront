import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Observable, catchError, firstValueFrom, from, of, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_ROLES } from '../../app.navigation';
import { ApiProblemError } from '../http/api-error';
import { apiUrl } from '../http/api-url';
import { mockError, mockResponse } from '../http/mock-response';
import { firebaseAuth } from './firebase-auth';

/** Usuario de la sesión: misma forma que SessionUser del backend (GET /api/auth/me). */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  /** Código del rol (AppRole.value); null si el sistema no define roles. */
  role: string | null;
}

/** Contraseña de los usuarios de ejemplo: la misma que cargan los scripts de la base. En modo mock vale para cualquier correo. */
export const DEMO_PASSWORD = 'Demo1234!';

/** Errores de Firebase Auth → el mismo ApiProblemError que muestra el login. */
function toLoginError(error: unknown): unknown {
  if (!(error instanceof FirebaseError)) return error;
  const detail =
    error.code === 'auth/too-many-requests'
      ? 'Hiciste demasiados intentos. Espera unos minutos e intenta de nuevo.'
      : error.code === 'auth/network-request-failed'
        ? 'No se pudo conectar con el servicio de inicio de sesión.'
        : 'El correo o la contraseña no son correctos.';
  return new ApiProblemError({ title: 'Unauthorized', status: 401, detail, code: 'INVALID_CREDENTIALS' });
}

/**
 * Sesión del usuario con Firebase Auth. El login y el logout los hace el SDK en el navegador (la sesión
 * sobrevive a una recarga); el nombre y el rol salen de GET /api/auth/me (users/{uid} en el backend), que
 * también rechaza a un usuario de Auth que no está habilitado en el sistema. Cada llamada a la API lleva el
 * ID token (authTokenInterceptor). En modo mock: login de demostración con el rol que se elige en el
 * encabezado ("Ver como").
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

  /** Recupera la sesión al abrir la app (provideAppInitializer): espera a Firebase Auth y pide /auth/me. */
  async load(): Promise<void> {
    if (environment.useMock) return;
    const auth = firebaseAuth();
    await auth.authStateReady();
    if (!auth.currentUser) return;
    try {
      this.state.set(await firstValueFrom(this.fetchMe()));
    } catch {
      this.state.set(null);
      await signOut(auth);
    }
  }

  login(email: string, password: string): Observable<SessionUser> {
    if (environment.useMock) return this.mockLogin(email, password).pipe(tap((user) => this.state.set(user)));
    const auth = firebaseAuth();
    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      catchError((error: unknown) => throwError(() => toLoginError(error))),
      switchMap(() =>
        this.fetchMe().pipe(
          // Entró en Auth pero el sistema no lo tiene habilitado (403 USER_NOT_ENABLED): no queda logueado.
          catchError((error: unknown) => from(signOut(auth)).pipe(switchMap(() => throwError(() => error)))),
        ),
      ),
      tap((user) => this.state.set(user)),
    );
  }

  logout(): Observable<void> {
    const request = environment.useMock ? mockResponse(undefined) : from(signOut(firebaseAuth()));
    return request.pipe(
      catchError(() => of(undefined)),
      tap(() => this.state.set(null)),
    );
  }

  /** La sesión venció (401 de la API): se olvida el usuario, se cierra Firebase Auth y la app vuelve al login. */
  clear(): void {
    this.state.set(null);
    if (!environment.useMock) void signOut(firebaseAuth());
  }

  /** Solo en modo mock: cambia el rol del usuario de demostración ("Ver como" del encabezado). */
  setRole(value: string): void {
    const role = APP_ROLES.find((option) => option.value === value);
    const current = this.state();
    if (role && current) this.state.set({ ...current, name: role.userName, role: role.value });
  }

  private fetchMe(): Observable<SessionUser> {
    return this.http.get<SessionUser>(apiUrl('/auth/me'));
  }

  private mockLogin(email: string, password: string): Observable<SessionUser> {
    if (password !== DEMO_PASSWORD) return mockError(401, 'El correo o la contraseña no son correctos.');
    const first = APP_ROLES[0];
    return mockResponse({ id: 'demo', name: first?.userName ?? 'Usuario de prueba', email, role: first?.value ?? null });
  }
}
