import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { errorMessage } from '../http/api-error';
import { CurrentUser, DEMO_PASSWORD } from './current-user';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="login">
      <main class="login__card">
        <section class="login__brand" aria-label="TECHFORB RH">
          <div class="login__identity">
            <span class="login__logo" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                <path d="M8 9.5h8M12 9.5v7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>
            <span>TECHFORB <span class="login__identity-suffix">RH</span></span>
          </div>
          <div class="login__introduction">
            <span class="login__lock" aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" stroke-width="1.7" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
              </svg>
            </span>
            <h2>Tu espacio de gestión de Recursos Humanos</h2>
            <p>Accedé a la información y los procesos del equipo desde un único lugar.</p>
          </div>
          <p class="login__access">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
              <path d="m9 12 2 2 4-4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Acceso exclusivo para la administración de RH
          </p>
        </section>
        <section class="login__content" aria-labelledby="login-title">
          <header class="login__heading">
            <span class="login__eyebrow">Bienvenido a TECHFORB</span>
            <h1 id="login-title">Iniciar sesión</h1>
            <p>Ingresá con tu correo corporativo y contraseña.</p>
          </header>
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="login__field">
              <label for="login-email">Correo corporativo <span class="login__required">*</span></label>
              <input id="login-email" type="email" formControlName="email" autocomplete="username"
                [attr.aria-invalid]="showError('email')" aria-describedby="login-email-error" />
              @if (showError('email')) {
                <span id="login-email-error" class="login__field-error">Ingresa un correo válido.</span>
              }
            </div>
            <div class="login__field">
              <label for="login-password">Contraseña <span class="login__required">*</span></label>
              <input id="login-password" type="password" formControlName="password" autocomplete="current-password"
                placeholder="Ingresá tu contraseña" [attr.aria-invalid]="showError('password')"
                aria-describedby="login-password-error" />
              @if (showError('password')) {
                <span id="login-password-error" class="login__field-error">Ingresa tu contraseña.</span>
              }
            </div>
            @if (error(); as message) {
              <div class="login__error" role="alert">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
                  <path d="M12 7.5v5.5m0 3.5h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                <span>{{ message }}</span>
              </div>
            }
            <button class="login__submit" type="submit" [disabled]="loading()">
              {{ loading() ? 'Ingresando…' : 'Ingresar' }}
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </form>
          <div class="login__notice">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" />
              <path d="M12 11v5m0-8h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span>Esta cuenta es de uso exclusivo de Recursos Humanos. Los colaboradores no necesitan una cuenta para realizar sus gestiones.</span>
          </div>
          @if (demo) {
            <p class="login__demo">Modo demostración: cualquier correo y la contraseña <strong>{{ demoPassword }}</strong>.</p>
          }
        </section>
      </main>
    </div>
  `,
  styles: `
    .login {
      min-height: 100vh;
      box-sizing: border-box;
      padding: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--background), var(--soft-background));
      color: var(--text-primary);
      font-family: var(--font-family);
      font-size: 14px;
      line-height: 1.5;
    }
    .login__card {
      width: 100%;
      max-width: 920px;
      min-height: 560px;
      display: grid;
      grid-template-columns: 43% 57%;
      overflow: hidden;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      box-shadow: 0 16px 48px color-mix(in srgb, var(--primary) 12%, transparent);
    }
    .login__brand {
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 48px;
      background: linear-gradient(135deg, var(--primary), var(--accent));
      color: var(--surface);
    }
    .login__identity {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .login__identity-suffix {
      font-weight: 400;
      opacity: 0.8;
    }
    .login__logo {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      flex: none;
      border-radius: 12px;
      background: color-mix(in srgb, var(--surface) 18%, transparent);
    }
    .login__introduction {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .login__lock {
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid color-mix(in srgb, var(--surface) 25%, transparent);
      border-radius: 16px;
      background: color-mix(in srgb, var(--surface) 11%, transparent);
    }
    .login__introduction h2 {
      margin: 0;
      max-width: 300px;
      color: var(--surface);
      font-size: 26px;
      line-height: 1.25;
      font-weight: 650;
      letter-spacing: -0.025em;
    }
    .login__introduction p {
      margin: 0;
      max-width: 290px;
      color: var(--surface);
      opacity: 0.85;
      line-height: 1.65;
    }
    .login__access {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--surface);
      opacity: 0.85;
      font-size: 12px;
    }
    .login__access svg {
      flex: none;
    }
    .login__content {
      padding: 64px 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 32px;
    }
    .login__heading {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .login__eyebrow {
      color: var(--primary);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.09em;
      text-transform: uppercase;
    }
    .login__heading h1 {
      margin: 0;
      font-size: 26px;
      line-height: 1.25;
      font-weight: 650;
      letter-spacing: -0.025em;
    }
    .login__heading p {
      margin: 0;
      color: var(--text-secondary);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .login__field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .login__field label {
      font-weight: 550;
    }
    .login__required,
    .login__field-error {
      color: var(--error);
    }
    .login__field input {
      width: 100%;
      height: 44px;
      box-sizing: border-box;
      padding: 10px 12px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text-primary);
      font: inherit;
    }
    .login__field input:focus-visible,
    .login__submit:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .login__field-error {
      font-size: 12px;
    }
    .login__error {
      padding: 12px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: color-mix(in srgb, var(--error) 10%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--error) 25%, var(--surface));
      border-radius: 8px;
      color: var(--error);
      font-size: 13px;
    }
    .login__error svg {
      flex: none;
    }
    .login__submit {
      width: 100%;
      min-height: 44px;
      padding: 11px 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: 0;
      border-radius: 8px;
      background: var(--primary);
      color: var(--surface);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }
    .login__submit:disabled {
      opacity: 0.7;
      cursor: wait;
    }
    .login__notice {
      padding: 14px 16px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
      background: var(--soft-background);
      border-radius: 12px;
      color: var(--text-secondary);
      font-size: 12px;
    }
    .login__notice svg {
      flex: none;
      color: var(--accent);
    }
    .login__demo {
      margin: 0;
      color: var(--text-secondary);
      font-size: 12px;
    }
    @media (max-width: 700px) {
      .login {
        padding: 16px;
      }
      .login__card {
        grid-template-columns: 1fr;
      }
      .login__brand {
        padding: 28px;
        gap: 24px;
      }
      .login__content {
        padding: 32px 28px;
      }
    }
  `,
})
export class LoginPage {
  readonly returnUrl = input<string>();

  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);
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
    if (this.loading()) return;
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

  private safeReturnUrl(): string {
    const target = this.returnUrl();
    return target?.startsWith('/') && !target.startsWith('//') ? target : '/';
  }
}
