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
      <section class="login__brand" aria-labelledby="brand-title">
        <svg class="login__decoration" viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <circle cx="545" cy="172" r="190" fill="currentColor" opacity=".055" />
          <circle cx="570" cy="643" r="262" fill="none" stroke="currentColor" opacity=".16" />
          <circle cx="570" cy="643" r="194" fill="none" stroke="currentColor" opacity=".11" />
          <circle cx="105" cy="700" r="105" fill="currentColor" opacity=".035" />
          <g fill="currentColor" opacity=".17">
            <circle cx="438" cy="80" r="2" /><circle cx="462" cy="80" r="2" /><circle cx="486" cy="80" r="2" /><circle cx="510" cy="80" r="2" />
            <circle cx="438" cy="104" r="2" /><circle cx="462" cy="104" r="2" /><circle cx="486" cy="104" r="2" /><circle cx="510" cy="104" r="2" />
            <circle cx="438" cy="128" r="2" /><circle cx="462" cy="128" r="2" /><circle cx="486" cy="128" r="2" /><circle cx="510" cy="128" r="2" />
          </g>
        </svg>
        <header class="login__identity">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="currentColor" fill-opacity=".15" stroke="currentColor" stroke-opacity=".25" />
            <path d="M8 11H28V15H20V27H16V15H8V11Z" fill="currentColor" />
            <circle cx="27" cy="25" r="3" fill="currentColor" fill-opacity=".75" />
          </svg>
          <strong>TECHFORB</strong><span class="login__divider" aria-hidden="true"></span><span>RH smart</span>
        </header>
        <div class="login__brand-content">
          <div class="login__symbol" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="7" width="28" height="26" rx="5" stroke="currentColor" stroke-width="2" />
              <path d="M12 15h16M12 21h10M12 27h7" stroke="currentColor" stroke-opacity=".7" stroke-width="2" stroke-linecap="round" />
              <circle cx="28" cy="27" r="3" fill="currentColor" />
            </svg>
          </div>
          <div class="login__introduction">
            <span class="login__eyebrow">TECHFORB RH · Plataforma interna de Recursos Humanos</span>
            <h1 id="brand-title">Tu espacio de gestión de Recursos Humanos</h1>
            <p>Accede a la información y los procesos del equipo desde un único lugar.</p>
          </div>
          <div class="login__exclusive">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.8" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span>Acceso exclusivo para la administración de RH</span>
          </div>
        </div>
        <div aria-hidden="true"></div>
      </section>

      <section class="login__panel" aria-labelledby="login-title">
        <header class="login__mobile-identity">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="currentColor" />
            <path d="M8 11H28V15H20V27H16V15H8V11Z" fill="var(--surface)" />
            <circle cx="27" cy="25" r="3" fill="var(--accent)" />
          </svg>
          <strong>TECHFORB</strong><span class="login__divider" aria-hidden="true"></span><span>RH smart</span>
        </header>
        <div class="login__form-content">
          <header class="login__form-heading">
            <h2 id="login-title">Inicio de sesión</h2>
            <p>Ingresa con tu correo corporativo y contraseña.</p>
          </header>
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="login__field">
              <label for="login-email">Correo corporativo</label>
              <div class="login__control-wrap">
                <svg class="login__control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.7" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <input id="login-email" type="email" formControlName="email" autocomplete="username" placeholder="nombre@techforb.com"
                  [attr.aria-invalid]="showError('email')" [attr.aria-describedby]="showError('email') ? 'login-email-error' : null" />
              </div>
              @if (showError('email')) {
                <span id="login-email-error" class="login__field-error">Ingresa un correo corporativo válido.</span>
              }
            </div>
            <div class="login__field">
              <label for="login-password">Contraseña</label>
              <div class="login__control-wrap">
                <svg class="login__control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.7" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
                <input id="login-password" [type]="showPassword() ? 'text' : 'password'" formControlName="password"
                  autocomplete="current-password" placeholder="Ingresa tu contraseña"
                  [attr.aria-invalid]="showError('password')" [attr.aria-describedby]="showError('password') ? 'login-password-error' : null" />
                <button class="login__eye" type="button" [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  [attr.aria-pressed]="showPassword()" (click)="showPassword.set(!showPassword())">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" />
                    <circle cx="12" cy="12" r="2.5" stroke="currentColor" stroke-width="1.7" />
                  </svg>
                </button>
              </div>
              @if (showError('password')) {
                <span id="login-password-error" class="login__field-error">Ingresa tu contraseña.</span>
              }
            </div>
            @if (error(); as message) {
              <p class="login__error" role="alert">{{ message }}</p>
            }
            <button class="login__submit" type="submit" [disabled]="loading()">
              @if (loading()) { <span class="login__spinner" aria-hidden="true"></span> }
              {{ loading() ? 'Ingresando…' : 'Ingresar' }}
            </button>
          </form>
          <div class="login__notice">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8" />
              <path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span>Esta cuenta es de uso exclusivo de Recursos Humanos. Los colaboradores no necesitan una cuenta para realizar sus gestiones.</span>
          </div>
          @if (demo) {
            <p class="login__demo">Modo demostración: cualquier correo y la contraseña <strong>{{ demoPassword }}</strong>.</p>
          }
        </div>
        <footer>TECHFORB · Uso interno</footer>
      </section>
    </main>
  `,
  styles: `
    :host { display: block; width: 100%; min-height: 100dvh; font-family: var(--font-family); }
    .login { width: 100%; min-height: 100dvh; display: grid; grid-template-columns: 1fr 1fr; background: var(--surface); color: var(--text-primary); }
    .login__brand { position: relative; min-width: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; gap: 3rem; padding: 3rem; background: linear-gradient(145deg, var(--primary), var(--accent)); color: var(--surface); }
    .login__decoration { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .login__identity, .login__mobile-identity { position: relative; display: flex; align-items: center; gap: 0.7rem; font-size: 0.8125rem; font-weight: 600; }
    .login__identity strong, .login__mobile-identity strong { font-size: 1rem; letter-spacing: 0.04em; }
    .login__divider { width: 1px; height: 1.2rem; margin: 0 0.3rem; background: currentColor; opacity: 0.25; }
    .login__brand-content { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 1.75rem; max-width: 28rem; }
    .login__symbol { width: 4.5rem; height: 4.5rem; display: grid; place-items: center; border: 1px solid currentColor; border-radius: 8px; background: rgba(255, 255, 255, 0.12); }
    .login__introduction { display: grid; gap: 1rem; }
    .login__eyebrow { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
    .login__introduction h1 { margin: 0; font-size: 1.875rem; line-height: 1.25; letter-spacing: -0.025em; }
    .login__introduction p { max-width: 23rem; margin: 0; font-size: 0.875rem; line-height: 1.65; }
    .login__exclusive { display: flex; align-items: center; gap: 0.625rem; padding: 0.7rem 0.95rem; border: 1px solid currentColor; border-radius: 999px; background: rgba(255, 255, 255, 0.12); font-size: 0.75rem; line-height: 1.5; }
    .login__exclusive svg, .login__notice svg { flex: none; }
    .login__panel { min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 2rem; padding: 3rem; }
    .login__mobile-identity { display: none; width: 100%; max-width: 25rem; color: var(--primary); }
    .login__mobile-identity span:last-child { color: var(--text-secondary); }
    .login__form-content { width: 100%; max-width: 25rem; margin: auto 0; display: flex; flex-direction: column; gap: 2rem; }
    .login__form-heading { display: grid; gap: 0.625rem; }
    .login__form-heading h2 { margin: 0; font-size: 1.75rem; line-height: 1.25; font-weight: 600; letter-spacing: -0.025em; }
    .login__form-heading p { margin: 0; color: var(--text-secondary); font-size: 0.875rem; line-height: 1.5; }
    form { display: flex; flex-direction: column; gap: 1.25rem; }
    .login__field { display: flex; flex-direction: column; gap: 0.5rem; }
    .login__field label { font-size: 0.8125rem; font-weight: 600; }
    .login__control-wrap { position: relative; }
    .login__control-icon { position: absolute; left: 0.95rem; top: 0.95rem; color: var(--text-secondary); pointer-events: none; }
    .login__control-wrap input { box-sizing: border-box; width: 100%; height: 3rem; padding: 0 3.1rem 0 2.75rem; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text-primary); font: inherit; font-size: 0.8125rem; }
    .login__control-wrap input:focus-visible, .login__eye:focus-visible, .login__submit:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .login__control-wrap input[aria-invalid='true'] { border-color: var(--error); }
    .login__eye { position: absolute; top: 0.3rem; right: 0.35rem; width: 2.4rem; height: 2.4rem; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; color: var(--text-secondary); cursor: pointer; }
    .login__field-error { color: var(--error); font-size: 0.75rem; }
    .login__error { margin: 0; padding: 0.875rem; border: 1px solid var(--error); border-radius: 8px; color: var(--error); font-size: 0.8125rem; }
    .login__submit { min-height: 3rem; margin-top: 0.25rem; display: flex; align-items: center; justify-content: center; gap: 0.625rem; border: 0; border-radius: 8px; background: var(--primary); color: var(--surface); font: inherit; font-size: 0.875rem; font-weight: 650; cursor: pointer; }
    .login__submit:disabled { opacity: 0.7; cursor: wait; }
    .login__spinner { width: 1rem; height: 1rem; border: 2px solid var(--accent); border-top-color: var(--surface); border-radius: 50%; animation: login-spin 0.8s linear infinite; }
    .login__notice { display: flex; align-items: flex-start; gap: 0.625rem; padding: 0.875rem; border: 1px solid var(--soft-background); border-radius: 8px; background: var(--soft-background); color: var(--text-secondary); font-size: 0.75rem; line-height: 1.5; }
    .login__notice svg { color: var(--primary); }
    .login__demo { margin: 0; color: var(--text-secondary); font-size: 0.75rem; }
    footer { width: 100%; max-width: 25rem; color: var(--text-secondary); font-size: 0.75rem; }
    @keyframes login-spin { to { transform: rotate(360deg); } }
    @media (max-width: 760px) {
      .login { grid-template-columns: 1fr; }
      .login__brand { padding: 2rem; gap: 1.5rem; }
      .login__brand-content { gap: 1rem; }
      .login__symbol { display: none; }
      .login__introduction h1 { font-size: 1.5rem; }
      .login__panel { min-height: 65dvh; padding: 2rem; }
      .login__mobile-identity { display: flex; }
    }
    @media (max-width: 420px) {
      .login__brand, .login__panel { padding: 1.5rem; }
      .login__exclusive { border-radius: 8px; }
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
  protected readonly showPassword = signal(false);
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
