import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { errorMessage } from '../http/api-error';
import { CurrentUser, DEMO_PASSWORD } from './current-user';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="login-page">
      <section class="brand-panel" aria-labelledby="brand-title">
        <div class="brand-content">
          <span class="brand-mark" aria-hidden="true">RH</span>
          <p class="brand-eyebrow">TECHFORB</p>
          <h1 id="brand-title">Gestión de RR.HH</h1>
          <p>Un espacio para organizar la gestión de las personas.</p>
        </div>
      </section>

      <section class="form-panel" aria-labelledby="login-title">
        <div class="form-content">
          <p class="form-eyebrow">RH smart</p>
          <h2 id="login-title">Inicia sesión</h2>
          <p class="form-description">Ingresa con tu correo corporativo para continuar.</p>

          @if (error()) {
            <div class="error-alert" role="alert">{{ error() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="field">
              <label for="login-email">Correo corporativo</label>
              <input id="login-email" type="email" formControlName="email" autocomplete="username" [attr.aria-invalid]="showError('email')" [attr.aria-describedby]="showError('email') ? 'login-email-error' : null" />
              @if (showError('email')) {
                <span id="login-email-error" class="field-error">Ingresa un correo válido.</span>
              }
            </div>
            <div class="field">
              <label for="login-password">Contraseña</label>
              <input id="login-password" type="password" formControlName="password" autocomplete="current-password" [attr.aria-invalid]="showError('password')" [attr.aria-describedby]="showError('password') ? 'login-password-error' : null" />
              @if (showError('password')) {
                <span id="login-password-error" class="field-error">Ingresa tu contraseña.</span>
              }
            </div>
            <button type="submit" [disabled]="loading()">{{ loading() ? 'Ingresando…' : 'Ingresar' }}</button>
          </form>

          @if (useMock) {
            <p class="demo-notice">Modo demostración: puedes usar cualquier correo y la contraseña <strong>{{ demoPassword }}</strong>.</p>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`
    .login-page {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      width: 100%;
      min-height: 100dvh;
      background: var(--background);
      color: var(--text-primary);
      font-family: var(--font-family);
    }
    .brand-panel, .form-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
    }
    .brand-panel {
      background: var(--soft-background);
      border-right: 1px solid var(--border);
    }
    .brand-content, .form-content {
      width: 100%;
      max-width: 400px;
    }
    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--primary);
      color: var(--surface);
      font-weight: 700;
    }
    .brand-eyebrow, .form-eyebrow {
      margin-top: var(--space-lg);
      color: var(--primary);
      font-size: .8rem;
      font-weight: 700;
      letter-spacing: .08em;
    }
    h1, h2 {
      margin: var(--space-sm) 0;
      font-size: 1.6rem;
      line-height: 1.3;
    }
    .brand-content > p:last-child, .form-description {
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .form-panel {
      background: var(--surface);
    }
    form {
      display: grid;
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }
    .field {
      display: grid;
      gap: var(--space-xs);
    }
    label {
      font-size: .875rem;
      font-weight: 600;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: .75rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: var(--surface);
      color: var(--text-primary);
      font: inherit;
    }
    input:focus-visible, button:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    input[aria-invalid='true'] {
      border-color: var(--error);
    }
    .field-error {
      color: var(--error);
      font-size: .8rem;
    }
    button {
      padding: .75rem 1rem;
      border: 1px solid var(--primary);
      border-radius: var(--radius-sm);
      background: var(--primary);
      color: var(--surface);
      cursor: pointer;
      font: inherit;
      font-weight: 600;
    }
    button:disabled {
      cursor: wait;
      opacity: .65;
    }
    .error-alert {
      padding: var(--space-sm);
      border: 1px solid var(--error);
      border-radius: var(--radius-sm);
      color: var(--error);
    }
    .demo-notice {
      margin-top: var(--space-lg);
      padding: var(--space-md);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--soft-background);
      color: var(--text-secondary);
      font-size: .875rem;
    }
    @media (max-width: 720px) {
      .login-page {
        grid-template-columns: 1fr;
      }
      .brand-panel {
        min-height: 180px;
        border-right: 0;
        border-bottom: 1px solid var(--border);
      }
      .form-panel {
        align-items: flex-start;
      }
    }
  `]
})
export class LoginPage {
  private readonly builder = inject(NonNullableFormBuilder);
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  readonly returnUrl = input<string>();
  protected readonly useMock = environment.useMock;
  protected readonly demoPassword = DEMO_PASSWORD;
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly form = this.builder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  protected showError(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  protected submit(): void {
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
      }
    });
  }

  private safeReturnUrl(value: string | undefined): string {
    if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || value.startsWith('/login')) {
      return '/';
    }
    return value;
  }
}
