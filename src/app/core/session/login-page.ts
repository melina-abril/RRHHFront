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
    <main class="login">
      <section class="brand-panel" aria-labelledby="brand-title">
        <svg class="brand-panel__decoration" viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
          <circle cx="545" cy="172" r="190" fill="currentColor" opacity=".055" />
          <circle cx="570" cy="643" r="262" stroke="currentColor" opacity=".16" />
          <circle cx="570" cy="643" r="194" stroke="currentColor" opacity=".11" />
          <circle cx="105" cy="700" r="105" fill="currentColor" opacity=".035" />
        </svg>
        <header class="brand-panel__header">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-opacity=".25" />
            <path d="M8 11H28V15H20V27H16V15H8V11Z" fill="currentColor" />
            <circle cx="27" cy="25" r="3" fill="currentColor" fill-opacity=".75" />
          </svg>
          <span class="brand-panel__name">TECHFORB</span>
          <span class="brand-panel__divider" aria-hidden="true"></span>
          <span class="brand-panel__product">RH smart</span>
        </header>

        <div class="brand-panel__content">
          <div class="brand-panel__icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="7" width="28" height="26" rx="5" stroke="currentColor" stroke-width="2" />
              <path d="M12 15h16M12 21h10M12 27h7" stroke="currentColor" stroke-opacity=".7" stroke-width="2" stroke-linecap="round" />
              <circle cx="28" cy="27" r="3" fill="currentColor" />
            </svg>
          </div>
          <div class="brand-panel__copy">
            <span class="brand-panel__eyebrow">TECHFORB RH · Plataforma interna de Recursos Humanos</span>
            <h1 id="brand-title">Tu espacio de gestión de Recursos Humanos</h1>
            <p>Accede a la información y los procesos del equipo desde un único lugar.</p>
          </div>
          <div class="brand-panel__access">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.8" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span>Acceso exclusivo para la administración de RH</span>
          </div>
        </div>
        <div aria-hidden="true"></div>
      </section>

      <section class="form-panel" aria-labelledby="login-title">
        <header class="mobile-brand">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="currentColor" />
            <path d="M8 11H28V15H20V27H16V15H8V11Z" fill="var(--surface)" />
          </svg>
          <span class="mobile-brand__name">TECHFORB RH</span>
          <span class="mobile-brand__divider" aria-hidden="true"></span>
          <span>RH smart</span>
        </header>

        <div class="form-panel__content">
          <header class="form-panel__heading">
            <h2 id="login-title">Inicio de sesión</h2>
            <p>Ingresa con tu correo corporativo y contraseña.</p>
          </header>

          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="login-field">
              <label for="login-email">Correo corporativo</label>
              <div class="login-field__control">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.7" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <input id="login-email" type="email" formControlName="email" autocomplete="username" placeholder="nombre@techforb.com" [attr.aria-invalid]="showError('email')" [attr.aria-describedby]="showError('email') ? 'login-email-error' : null" />
              </div>
              @if (showError('email')) {
                <span id="login-email-error" class="login-field__error">Ingresa un correo corporativo válido.</span>
              }
            </div>

            <div class="login-field">
              <label for="login-password">Contraseña</label>
              <div class="login-field__control">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.7" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
                <input id="login-password" [type]="passwordVisible() ? 'text' : 'password'" formControlName="password" autocomplete="current-password" placeholder="Ingresa tu contraseña" [attr.aria-invalid]="showError('password')" [attr.aria-describedby]="showError('password') ? 'login-password-error' : null" />
                <button class="login-field__visibility" type="button" [attr.aria-label]="passwordVisible() ? 'Ocultar contraseña' : 'Mostrar contraseña'" [attr.aria-pressed]="passwordVisible()" (click)="passwordVisible.update(value => !value)">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                    <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.7" />
                  </svg>
                </button>
              </div>
              @if (showError('password')) {
                <span id="login-password-error" class="login-field__error">Ingresa tu contraseña.</span>
              }
            </div>

            @if (error(); as message) {
              <p class="login-error" role="alert">{{ message }}</p>
            }

            <button class="login-submit" type="submit" [disabled]="loading()">
              @if (loading()) {
                <span class="login-submit__spinner" aria-hidden="true"></span>
              }
              <span>{{ loading() ? 'Ingresando…' : 'Ingresar' }}</span>
            </button>
          </form>

          <div class="access-notice">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
              <path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span>Esta cuenta es de uso exclusivo de Recursos Humanos. Los colaboradores no necesitan una cuenta para realizar sus gestiones.</span>
          </div>
          @if (demo) {
            <p class="demo-notice">Modo demostración: cualquier correo y la contraseña <strong>{{ demoPassword }}</strong>.</p>
          }
        </div>
        <footer class="form-panel__footer">TECHFORB · Uso interno</footer>
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      min-height: 100dvh;
      font-family: var(--font-family);
    }
    .login {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      min-height: 100dvh;
      background: var(--surface);
      color: var(--text-primary);
    }
    .brand-panel {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 3rem;
      min-width: 0;
      overflow: hidden;
      padding: 3rem;
      background: linear-gradient(145deg, var(--primary), var(--accent));
      color: var(--surface);
    }
    .brand-panel__decoration {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }
    .brand-panel__header {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.7rem;
    }
    .brand-panel__name {
      font-size: 1rem;
      font-weight: 750;
      letter-spacing: 0.04em;
    }
    .brand-panel__divider, .mobile-brand__divider {
      width: 1px;
      height: 19px;
      margin: 0 0.3rem;
      background: var(--border);
    }
    .brand-panel__product {
      font-size: 0.8125rem;
      font-weight: 600;
    }
    .brand-panel__content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.75rem;
      max-width: 450px;
    }
    .brand-panel__icon {
      display: grid;
      place-items: center;
      width: 72px;
      height: 72px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--soft-background);
      color: var(--primary);
    }
    .brand-panel__copy {
      display: grid;
      gap: 1rem;
    }
    .brand-panel__eyebrow {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .brand-panel__copy h1 {
      margin: 0;
      font-size: 1.875rem;
      line-height: 1.25;
      font-weight: 700;
      letter-spacing: -0.025em;
    }
    .brand-panel__copy p {
      max-width: 370px;
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.65;
    }
    .brand-panel__access {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.7rem 0.95rem;
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 0.75rem;
      line-height: 1.5;
    }
    .brand-panel__access svg, .access-notice svg {
      flex: none;
    }
    .form-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      min-width: 0;
      padding: 3rem;
      background: var(--surface);
    }
    .mobile-brand {
      display: none;
      align-items: center;
      gap: 0.625rem;
      width: 100%;
      max-width: 400px;
      color: var(--primary);
      font-size: 0.8125rem;
    }
    .mobile-brand__name {
      font-size: 1rem;
      font-weight: 750;
      letter-spacing: 0.04em;
    }
    .form-panel__content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      width: 100%;
      max-width: 400px;
      margin: auto 0;
    }
    .form-panel__heading {
      display: grid;
      gap: 0.625rem;
    }
    .form-panel__heading h2 {
      margin: 0;
      font-size: 1.75rem;
      line-height: 1.25;
      font-weight: 600;
      letter-spacing: -0.025em;
    }
    .form-panel__heading p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .login-field {
      display: grid;
      gap: 0.5rem;
    }
    .login-field label {
      font-size: 0.8125rem;
      font-weight: 600;
    }
    .login-field__control {
      position: relative;
      display: flex;
      align-items: center;
    }
    .login-field__control > svg {
      position: absolute;
      left: 15px;
      color: var(--text-secondary);
      pointer-events: none;
    }
    .login-field input {
      width: 100%;
      height: 48px;
      padding: 0 44px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--text-primary);
      font: inherit;
      font-size: 0.8125rem;
    }
    .login-field input:focus-visible, .login-field__visibility:focus-visible, .login-submit:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .login-field input[aria-invalid='true'] {
      border-color: var(--error);
    }
    .login-field__visibility {
      position: absolute;
      right: 6px;
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border: 0;
      border-radius: 8px;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .login-field__error {
      color: var(--error);
      font-size: 0.75rem;
    }
    .login-error {
      margin: 0;
      padding: 0.75rem;
      border-radius: 8px;
      background: var(--soft-background);
      color: var(--error);
      font-size: 0.8125rem;
    }
    .login-submit {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.625rem;
      width: 100%;
      min-height: 48px;
      margin-top: 0.25rem;
      padding: 0.75rem 1rem;
      border: 0;
      border-radius: 8px;
      background: var(--primary);
      color: var(--surface);
      font: inherit;
      font-size: 0.875rem;
      font-weight: 650;
      cursor: pointer;
    }
    .login-submit:disabled {
      cursor: wait;
      opacity: 0.7;
    }
    .login-submit__spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--accent);
      border-top-color: var(--surface);
      border-radius: 50%;
      animation: login-spin 0.8s linear infinite;
    }
    .access-notice {
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
      padding: 0.875rem;
      border: 1px solid var(--soft-background);
      border-radius: 8px;
      background: var(--soft-background);
      color: var(--text-secondary);
      font-size: 0.75rem;
      line-height: 1.5;
    }
    .access-notice svg {
      color: var(--primary);
    }
    .demo-notice {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.75rem;
      line-height: 1.5;
    }
    .form-panel__footer {
      width: 100%;
      max-width: 400px;
      color: var(--text-secondary);
      font-size: 0.75rem;
      line-height: 1.5;
    }
    @keyframes login-spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 800px) {
      .brand-panel, .brand-panel__decoration {
        display: none;
      }
      .login {
        grid-template-columns: 1fr;
      }
      .form-panel {
        min-height: 100dvh;
        padding: 2rem 1.25rem;
      }
      .mobile-brand {
        display: flex;
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
  protected readonly passwordVisible = signal(false);
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
