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
      <section class="login-brand" aria-label="Gestión de RR.HH.">
        <div class="login-brand__content">
          <span class="login-brand__mark" aria-hidden="true">RH</span>
          <p class="login-brand__eyebrow">TECHFORB</p>
          <h1>Gestión de RR.HH.</h1>
          <p>Un espacio para organizar la gestión de Recursos Humanos.</p>
        </div>
      </section>
      <section class="login-panel" aria-labelledby="login-title">
        <div class="login-panel__content">
          <p class="login-panel__eyebrow">Acceso interno</p>
          <h2 id="login-title">Inicia sesión</h2>
          <p class="login-panel__description">Ingresa con tu correo corporativo y contraseña.</p>

          @if (error()) {
            <div class="login-error" role="alert">{{ error() }}</div>
          }

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="login-field">
              <label for="login-email">Correo corporativo</label>
              <input id="login-email" type="email" formControlName="email" autocomplete="username"
                [attr.aria-invalid]="showError('email')" [attr.aria-describedby]="showError('email') ? 'login-email-error' : null" />
              @if (showError('email')) {
                <span id="login-email-error" class="login-field__error">Ingresa un correo electrónico válido.</span>
              }
            </div>
            <div class="login-field">
              <label for="login-password">Contraseña</label>
              <input id="login-password" type="password" formControlName="password" autocomplete="current-password"
                [attr.aria-invalid]="showError('password')" [attr.aria-describedby]="showError('password') ? 'login-password-error' : null" />
              @if (showError('password')) {
                <span id="login-password-error" class="login-field__error">Ingresa tu contraseña.</span>
              }
            </div>
            <button class="login-submit" type="submit" [disabled]="loading()">
              {{ loading() ? 'Ingresando…' : 'Ingresar' }}
            </button>
          </form>

          @if (useMock) {
            <p class="login-demo">Modo demostración: usa cualquier correo válido y la contraseña <strong>{{ demoPassword }}</strong>.</p>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100dvh;
      font-family: var(--font-family);
    }
    .login-page {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      min-height: 100dvh;
      background: var(--surface);
      color: var(--text-primary);
    }
    .login-brand, .login-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
    }
    .login-brand {
      background: var(--soft-background);
      border-right: 1px solid var(--border);
    }
    .login-brand__content, .login-panel__content {
      width: 100%;
      max-width: 400px;
    }
    .login-brand__mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius);
      background: var(--primary);
      color: var(--surface);
      font-weight: 700;
    }
    .login-brand__eyebrow, .login-panel__eyebrow {
      margin: var(--space-xl) 0 var(--space-sm);
      color: var(--primary);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h1, h2 {
      margin: 0;
      font-size: 1.75rem;
      line-height: 1.25;
    }
    .login-brand__content > p:last-child, .login-panel__description {
      margin: var(--space-md) 0 var(--space-xl);
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .login-panel__eyebrow {
      margin-top: 0;
    }
    .login-field {
      display: grid;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }
    .login-field label {
      font-size: 0.875rem;
      font-weight: 600;
    }
    .login-field input {
      box-sizing: border-box;
      width: 100%;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text-primary);
      font: inherit;
    }
    .login-field input:focus-visible, .login-submit:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .login-field input[aria-invalid='true'] {
      border-color: var(--error);
    }
    .login-field__error {
      color: var(--error);
      font-size: 0.8125rem;
    }
    .login-submit {
      width: 100%;
      margin-top: var(--space-sm);
      padding: 12px;
      border: 0;
      border-radius: var(--radius);
      background: var(--primary);
      color: var(--surface);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .login-submit:disabled {
      cursor: wait;
      opacity: 0.7;
    }
    .login-error {
      margin-bottom: var(--space-md);
      padding: var(--space-md);
      border: 1px solid var(--error);
      border-radius: var(--radius);
      color: var(--error);
    }
    .login-demo {
      margin-top: var(--space-lg);
      padding: var(--space-md);
      border-radius: var(--radius);
      background: var(--soft-background);
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }
    @media (max-width: 720px) {
      .login-page {
        grid-template-columns: 1fr;
      }
      .login-brand {
        padding: var(--space-lg);
        border-right: 0;
        border-bottom: 1px solid var(--border);
      }
      .login-panel {
        align-items: flex-start;
        padding: var(--space-xl) var(--space-lg);
      }
    }
  `]
})
export class LoginPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  readonly returnUrl = input<string>();
  readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);
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

    this.error.set(null);
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();
    this.currentUser.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl(this.safeReturnUrl(this.returnUrl()));
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.error.set(errorMessage(error));
      }
    });
  }

  private safeReturnUrl(value: string | undefined): string {
    if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
      return '/';
    }
    return value;
  }
}
