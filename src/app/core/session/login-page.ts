import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessage } from '../http/api-error';
import { CurrentUser, DEMO_PASSWORD } from './current-user';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="login-page">
      <section class="brand-panel" aria-label="Gestión de RR.HH">
        <div class="brand-content">
          <span class="brand-mark" aria-hidden="true">RH</span>
          <p class="brand-eyebrow">TECHFORB</p>
          <h1>Gestión de RR.HH</h1>
          <p>Tu espacio para gestionar los procesos de Recursos Humanos.</p>
        </div>
      </section>

      <section class="form-panel" aria-labelledby="login-title">
        <div class="form-content">
          <p class="form-eyebrow">RH smart</p>
          <h2 id="login-title">Inicia sesión</h2>
          <p class="form-intro">Ingresa con tu correo corporativo para continuar.</p>

          @if (error()) {
            <div class="error-message" role="alert">{{ error() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="form-field">
              <label for="login-email">Correo corporativo</label>
              <input id="login-email" type="email" autocomplete="username" formControlName="email"
                [attr.aria-invalid]="showError('email')" aria-describedby="login-email-error" />
              @if (showError('email')) {
                <span id="login-email-error" class="field-error">Ingresa un correo válido.</span>
              }
            </div>

            <div class="form-field">
              <label for="login-password">Contraseña</label>
              <input id="login-password" type="password" autocomplete="current-password" formControlName="password"
                [attr.aria-invalid]="showError('password')" aria-describedby="login-password-error" />
              @if (showError('password')) {
                <span id="login-password-error" class="field-error">Ingresa tu contraseña.</span>
              }
            </div>

            <button class="submit-button" type="submit" [disabled]="loading()">
              {{ loading() ? 'Ingresando…' : 'Ingresar' }}
            </button>
          </form>

          @if (useMock) {
            <p class="demo-note">Modo demostración: usa tu correo y la contraseña <strong>{{ demoPassword }}</strong>.</p>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100dvh;
      font-family: var(--font-family);
    }

    .login-page {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      min-height: 100dvh;
      background: var(--surface);
    }

    .brand-panel {
      display: flex;
      align-items: center;
      padding: clamp(2rem, 6vw, 5rem);
      background: var(--primary);
      color: var(--surface);
    }

    .brand-content {
      max-width: 30rem;
    }

    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3.5rem;
      height: 3.5rem;
      border: 1px solid var(--accent);
      border-radius: var(--radius-md);
      font-weight: 700;
    }

    .brand-eyebrow, .form-eyebrow {
      margin: 2rem 0 0.75rem;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.12em;
    }

    .brand-content h1 {
      margin: 0 0 1rem;
      font-size: clamp(1.8rem, 3vw, 2.5rem);
    }

    .brand-content p:last-child {
      line-height: 1.6;
    }

    .form-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .form-content {
      width: 100%;
      max-width: 25rem;
    }

    .form-eyebrow {
      color: var(--primary);
    }

    .form-content h2 {
      margin: 0 0 0.5rem;
      color: var(--text-primary);
      font-size: 1.6rem;
    }

    .form-intro, .demo-note {
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .form-intro {
      margin: 0 0 2rem;
    }

    .form-field {
      display: grid;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }

    .form-field label {
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .form-field input {
      width: 100%;
      box-sizing: border-box;
      padding: 0.75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text-primary);
      font: inherit;
    }

    .form-field input:focus-visible, .submit-button:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }

    .field-error, .error-message {
      color: var(--error);
      font-size: 0.85rem;
    }

    .error-message {
      margin-bottom: 1rem;
      padding: 0.75rem;
      border: 1px solid var(--error);
      border-radius: var(--radius-sm);
      background: var(--surface);
    }

    .submit-button {
      width: 100%;
      padding: 0.8rem;
      border: 0;
      border-radius: var(--radius-sm);
      background: var(--primary);
      color: var(--surface);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .submit-button:disabled {
      opacity: 0.65;
      cursor: wait;
    }

    .demo-note {
      margin-top: 1.5rem;
      padding: 0.9rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--soft-background);
      font-size: 0.85rem;
    }

    @media (max-width: 700px) {
      .login-page {
        grid-template-columns: 1fr;
      }

      .brand-panel {
        padding: 2rem;
      }

      .brand-eyebrow {
        margin-top: 1rem;
      }

      .form-panel {
        padding: 2rem 1.25rem;
      }
    }
  `],
})
export class LoginPage {
  private readonly builder = inject(NonNullableFormBuilder);
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  readonly returnUrl = input<string>();
  readonly form = this.builder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  readonly loading = signal(false);
  readonly error = signal('');
  readonly useMock: boolean = environment.useMock;
  readonly demoPassword: string = DEMO_PASSWORD;

  showError(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    if (this.loading()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.currentUser.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl(this.safeReturnUrl(this.returnUrl()));
      },
      error: (cause: unknown) => {
        this.loading.set(false);
        this.error.set(errorMessage(cause));
      },
    });
  }

  private safeReturnUrl(value: string | undefined): string {
    if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || value.startsWith('/login')) {
      return '/';
    }
    return value;
  }
}
