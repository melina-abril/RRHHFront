import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { APP_TITLE } from '../../app.navigation';
import { errorMessage } from '../http/api-error';
import { CurrentUser, DEMO_PASSWORD } from './current-user';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="login-page">
      <section class="login-panel" aria-labelledby="login-title">
        <div class="brand-mark" aria-hidden="true">RH</div>
        <p class="brand-name">TECHFORB</p>
        <h1 id="login-title">{{ title }}</h1>
        <p class="intro">Ingresa con tu correo corporativo para acceder a la gestión de Recursos Humanos.</p>

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label for="email">Correo electrónico</label>
            <input id="email" type="email" formControlName="email" autocomplete="username"
              [attr.aria-invalid]="showError() && form.controls.email.invalid"
              [attr.aria-describedby]="showError() && form.controls.email.invalid ? 'email-error' : null" />
            @if (showError() && form.controls.email.invalid) {
              <p id="email-error" class="field-error">Ingresa un correo electrónico válido.</p>
            }
          </div>

          <div class="field">
            <label for="password">Contraseña</label>
            <input id="password" type="password" formControlName="password" autocomplete="current-password"
              [attr.aria-invalid]="showError() && form.controls.password.invalid"
              [attr.aria-describedby]="showError() && form.controls.password.invalid ? 'password-error' : null" />
            @if (showError() && form.controls.password.invalid) {
              <p id="password-error" class="field-error">Ingresa tu contraseña.</p>
            }
          </div>

          @if (error()) {
            <p class="login-error" role="alert">{{ error() }}</p>
          }

          <button class="submit-button" type="submit" [disabled]="loading()">
            {{ loading() ? 'Ingresando…' : 'Ingresar' }}
          </button>
        </form>

        @if (useMock) {
          <p class="demo-note">Modo demostración: usa tu correo y la contraseña {{ demoPassword }}.</p>
        }
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100dvh;
      background: var(--background);
      color: var(--text-primary);
      font-family: var(--font-family);
    }
    .login-page {
      width: 100%;
      min-height: 100dvh;
      display: grid;
      place-items: center;
      padding: var(--space-lg);
      box-sizing: border-box;
    }
    .login-panel {
      width: min(100%, 420px);
      padding: var(--space-xl);
      box-sizing: border-box;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
    }
    .brand-mark {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius);
      background: var(--soft-background);
      color: var(--primary);
      font-weight: 700;
    }
    .brand-name {
      margin: var(--space-md) 0 var(--space-xs);
      color: var(--primary);
      font-weight: 700;
      letter-spacing: .08em;
      font-size: .75rem;
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    .intro {
      margin: var(--space-sm) 0 var(--space-lg);
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .field {
      margin-bottom: var(--space-md);
    }
    label {
      display: block;
      margin-bottom: var(--space-xs);
      font-weight: 600;
      font-size: .875rem;
    }
    input {
      width: 100%;
      padding: .75rem;
      box-sizing: border-box;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--surface);
      color: var(--text-primary);
      font: inherit;
    }
    input:focus-visible, .submit-button:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .field-error, .login-error {
      color: var(--error);
      font-size: .875rem;
    }
    .field-error {
      margin: var(--space-xs) 0 0;
    }
    .login-error {
      padding: var(--space-sm);
      border: 1px solid var(--error);
      border-radius: var(--radius);
    }
    .submit-button {
      width: 100%;
      padding: .75rem;
      border: 0;
      border-radius: var(--radius);
      background: var(--primary);
      color: var(--surface);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .submit-button:disabled {
      opacity: .6;
      cursor: wait;
    }
    .demo-note {
      margin: var(--space-md) 0 0;
      padding: var(--space-sm);
      border-radius: var(--radius);
      background: var(--soft-background);
      color: var(--text-secondary);
      font-size: .875rem;
    }
    @media (max-width: 480px) {
      .login-page {
        padding: var(--space-sm);
      }
      .login-panel {
        padding: var(--space-lg);
      }
    }
  `]
})
export class LoginPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  readonly returnUrl = input<string>();
  protected readonly title = APP_TITLE;
  protected readonly useMock = environment.useMock;
  protected readonly demoPassword = DEMO_PASSWORD;
  protected readonly loading = signal(false);
  protected readonly showError = signal(false);
  protected readonly error = signal('');
  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  protected submit(): void {
    this.showError.set(true);
    this.error.set('');
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
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
    if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\') || /[\u0000-\u001f]/.test(value) || value === '/login' || value.startsWith('/login?')) {
      return '/';
    }
    return value;
  }
}
