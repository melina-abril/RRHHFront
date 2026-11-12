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
        <svg class="login__decoration" viewBox="0 0 600 760" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true">
          <circle cx="545" cy="172" r="190" fill="currentColor" opacity=".055" />
          <circle cx="570" cy="643" r="262" stroke="currentColor" opacity=".16" />
          <circle cx="570" cy="643" r="194" stroke="currentColor" opacity=".11" />
          <circle cx="105" cy="700" r="105" fill="currentColor" opacity=".035" />
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
          <div class="login__document-icon" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect x="6" y="7" width="28" height="26" rx="5" stroke="currentColor" stroke-width="2" />
              <path d="M12 15h16M12 21h10M12 27h7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <circle cx="28" cy="27" r="3" fill="currentColor" />
            </svg>
          </div>
          <div class="login__introduction">
            <span class="login__eyebrow">TECHFORB RH · Plataforma interna de Recursos Humanos</span>
            <h1 id="brand-title">Tu espacio de gestión de Recursos Humanos</h1>
            <p>Accede a la información y los procesos del equipo desde un único lugar.</p>
          </div>
          <div class="login__access-label">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.8" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
            <span>Acceso exclusivo para la administración de RH</span>
          </div>
        </div>
        <div class="login__brand-footer" aria-hidden="true"></div>
      </section>

      <section class="login__form-panel" aria-labelledby="login-title">
        <header class="login__mobile-identity">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="currentColor" />
            <path d="M8 11H28V15H20V27H16V15H8V11Z" fill="var(--color-surface)" />
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
                <svg class="login__field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.7" />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <input id="login-email" type="email" formControlName="email" autocomplete="username" placeholder="nombre@techforb.com"
                  [attr.aria-invalid]="showError('email')" [attr.aria-describedby]="showError('email') ? 'login-email-error' : null" />
              </div>
              @if (showError('email')) {
                <span id="login-email-error" class="login__field-error">Ingresa un correo válido.</span>
              }
            </div>
            <div class="login__field">
              <label for="login-password">Contraseña</label>
              <div class="login__control-wrap">
                <svg class="login__field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="5" y="10" width="14" height="11" rx="2" stroke="currentColor" stroke-width="1.7" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
                </svg>
                <input id="login-password" [type]="passwordVisible() ? 'text' : 'password'" formControlName="password"
                  autocomplete="current-password" placeholder="Ingresa tu contraseña"
                  [attr.aria-invalid]="showError('password')" [attr.aria-describedby]="showError('password') ? 'login-password-error' : null" />
                <button class="login__visibility" type="button" [attr.aria-label]="passwordVisible() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  [attr.aria-pressed]="passwordVisible()" (click)="passwordVisible.set(!passwordVisible())">
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
              @if (loading()) { <span class="login__spinner" aria-hidden="true"></span>Ingresando… }
              @else { Ingresar }
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
        <footer class="login__footer">TECHFORB · Uso interno</footer>
      </section>
    </main>
  `,
  styles: `
    :host { display: block; background: var(--color-background); color: var(--color-text); font-family: var(--font-family); }
    .login { width: 100%; max-width: 1200px; min-height: 760px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; background: var(--color-surface); }
    .login__brand { position: relative; min-width: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; gap: 48px; padding: 48px; background: linear-gradient(145deg, var(--color-primary), var(--accent)); color: var(--color-surface); }
    .login__decoration { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .login__identity, .login__mobile-identity { position: relative; display: flex; align-items: center; gap: 11px; font-size: 13px; }
    .login__identity strong, .login__mobile-identity strong { font-size: 16px; letter-spacing: .04em; }
    .login__divider { width: 1px; height: 19px; margin: 0 5px; background: currentColor; opacity: .3; }
    .login__brand-content { position: relative; display: flex; flex-direction: column; align-items: flex-start; gap: 28px; max-width: 450px; }
    .login__document-icon { width: 72px; height: 72px; display: grid; place-items: center; border: 1px solid color-mix(in srgb, currentColor 20%, transparent); border-radius: 8px; background: color-mix(in srgb, currentColor 12%, transparent); }
    .login__introduction { display: grid; gap: 16px; }
    .login__eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
    .login__introduction h1 { margin: 0; font-size: 30px; line-height: 1.25; font-weight: 700; letter-spacing: -.025em; }
    .login__introduction p { max-width: 370px; margin: 0; font-size: 14px; line-height: 1.65; }
    .login__access-label { display: flex; align-items: center; gap: 10px; padding: 11px 15px; border: 1px solid color-mix(in srgb, currentColor 20%, transparent); border-radius: 999px; background: color-mix(in srgb, currentColor 12%, transparent); font-size: 12px; line-height: 1.5; }
    .login__access-label svg { flex: none; }
    .login__brand-footer { height: 36px; }
    .login__form-panel { min-width: 0; min-height: 760px; display: flex; flex-direction: column; align-items: center; justify-content: space-between; gap: 32px; padding: 48px; background: var(--color-surface); }
    .login__mobile-identity { display: none; width: 100%; max-width: 400px; color: var(--color-primary); }
    .login__form-content { width: 100%; max-width: 400px; margin: auto 0; display: flex; flex-direction: column; gap: 32px; }
    .login__form-heading { display: grid; gap: 10px; }
    .login__form-heading h2 { margin: 0; font-size: 28px; line-height: 1.25; font-weight: 600; letter-spacing: -.025em; }
    .login__form-heading p, .login__footer { margin: 0; color: var(--color-text-muted); font-size: 14px; line-height: 1.5; }
    form { display: flex; flex-direction: column; gap: 20px; }
    .login__field { display: flex; flex-direction: column; gap: 8px; }
    .login__field label { font-size: 13px; font-weight: 600; }
    .login__control-wrap { position: relative; }
    .login__field-icon { position: absolute; left: 15px; top: 15px; color: var(--color-text-muted); pointer-events: none; }
    .login__control-wrap input { box-sizing: border-box; width: 100%; height: 48px; padding: 0 44px; border: 1px solid var(--color-border); border-radius: 10px; background: var(--color-surface); color: var(--color-text); font: inherit; font-size: 13px; }
    .login__control-wrap input:focus-visible, .login__visibility:focus-visible, .login__submit:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
    .login__control-wrap input[aria-invalid='true'] { border-color: var(--color-danger); }
    .login__visibility { position: absolute; right: 6px; top: 5px; width: 38px; height: 38px; display: grid; place-items: center; border: 0; border-radius: 8px; background: transparent; color: var(--color-text-muted); cursor: pointer; }
    .login__field-error { color: var(--color-danger); font-size: 12px; }
    .login__error { margin: 0; padding: 12px; border-radius: 8px; background: var(--color-danger-surface); color: var(--color-danger); font-size: 13px; }
    .login__submit { width: 100%; min-height: 48px; margin-top: 4px; padding: 12px 16px; display: flex; align-items: center; justify-content: center; gap: 10px; border: 0; border-radius: 10px; background: var(--color-primary); color: var(--color-on-primary); font: inherit; font-size: 14px; font-weight: 650; cursor: pointer; }
    .login__submit:disabled { opacity: .7; cursor: wait; }
    .login__spinner { width: 16px; height: 16px; border: 2px solid color-mix(in srgb, currentColor 30%, transparent); border-top-color: currentColor; border-radius: 50%; animation: login-spin .8s linear infinite; }
    .login__notice { display: flex; align-items: flex-start; gap: 10px; padding: 14px; border: 1px solid var(--color-surface-muted); border-radius: 8px; background: var(--color-surface-muted); color: var(--color-text-muted); font-size: 12px; line-height: 1.5; }
    .login__notice svg { flex: none; color: var(--color-primary); }
    .login__demo { margin: 0; font-size: 12px; color: var(--color-text-muted); }
    .login__footer { width: 100%; max-width: 400px; font-size: 12px; }
    @keyframes login-spin { to { transform: rotate(360deg); } }
    @media (max-width: 760px) { .login { grid-template-columns: 1fr; min-height: 100vh; } .login__brand { min-height: 290px; padding: 32px; gap: 24px; } .login__brand-content { gap: 14px; } .login__document-icon, .login__brand-footer { display: none; } .login__introduction h1 { font-size: 24px; } .login__form-panel { min-height: 520px; padding: 32px 24px; } }
    @media (max-width: 420px) { .login__brand { padding: 24px; } .login__form-panel { padding: 24px; } .login__access-label { border-radius: 8px; } }
    @media (prefers-reduced-motion: reduce) { .login__spinner { animation: none; } }
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
