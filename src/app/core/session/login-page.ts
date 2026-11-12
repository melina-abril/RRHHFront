import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { APP_TITLE } from '../../app.navigation';
import { errorMessage } from '../http/api-error';
import { CurrentUser, DEMO_PASSWORD } from './current-user';

/** Pantalla de inicio de sesión (fija): correo y contraseña contra POST /auth/login. */
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="login">
      <section class="card login__card" aria-labelledby="login-title">
        <p class="login__system">{{ title }}</p>
        <h1 id="login-title">Iniciar sesión</h1>
        <p class="login__hint">Ingresa con tu correo y tu contraseña.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="form-field">
            <label for="login-email">Correo</label>
            <input id="login-email" type="email" formControlName="email" autocomplete="username"
              [attr.aria-invalid]="showError('email')" aria-describedby="login-email-error" />
            @if (showError('email')) {
              <span id="login-email-error" class="form-field__error">Ingresa un correo válido.</span>
            }
          </div>
          <div class="form-field">
            <label for="login-password">Contraseña</label>
            <input id="login-password" type="password" formControlName="password" autocomplete="current-password"
              [attr.aria-invalid]="showError('password')" aria-describedby="login-password-error" />
            @if (showError('password')) {
              <span id="login-password-error" class="form-field__error">Ingresa tu contraseña.</span>
            }
          </div>

          @if (error(); as message) {
            <p class="login__error" role="alert">{{ message }}</p>
          }

          <button class="button login__submit" type="submit" [disabled]="loading()">
            {{ loading() ? 'Ingresando…' : 'Ingresar' }}
          </button>
        </form>

        @if (demo) {
          <p class="login__demo">Modo demostración: cualquier correo y la contraseña <strong>{{ demoPassword }}</strong>.</p>
        }
      </section>
    </main>
  `,
  styles: `
    .login { min-height: 100vh; display: grid; place-items: center; padding: var(--space-md); background: var(--color-surface-muted); }
    .login__card { width: min(26rem, 100%); display: grid; gap: var(--space-md); }
    .login__card h1 { margin: 0; }
    .login__system { margin: 0; color: var(--color-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; font-size: 0.8rem; }
    .login__hint { margin: 0; color: var(--color-text-muted); }
    form { display: grid; gap: var(--space-md); }
    .login__error { margin: 0; padding: var(--space-sm) var(--space-md); border-radius: var(--radius); background: var(--color-danger-surface); color: var(--color-danger); }
    .login__submit { width: 100%; }
    .login__demo { margin: 0; font-size: 0.85rem; color: var(--color-text-muted); }
  `,
})
export class LoginPage {
  /** A dónde volver después de entrar (?returnUrl=…, lo pone authGuard). */
  readonly returnUrl = input<string>();

  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);
  protected readonly title = APP_TITLE;
  protected readonly demo = environment.useMock;
  protected readonly demoPassword = DEMO_PASSWORD;
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly submitted = signal(false);
  protected readonly form = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected showError(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.submitted());
  }

  protected submit(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.currentUser.login(email, password).subscribe({
      next: () => void this.router.navigateByUrl(this.safeReturnUrl()),
      error: (error: unknown) => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      },
    });
  }

  /** Solo rutas internas: un returnUrl externo no se sigue. */
  private safeReturnUrl(): string {
    const target = this.returnUrl();
    return target?.startsWith('/') && !target.startsWith('//') ? target : '/';
  }
}
