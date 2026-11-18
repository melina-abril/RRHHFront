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
    <main class="login-screen">
      <section class="login-brand" aria-label="RH smart">
        <div class="brand-content">
          <span class="brand-mark" aria-hidden="true">RH</span>
          <h1>RH smart</h1>
          <p>La gestión de Recursos Humanos en un solo lugar.</p>
          <span class="brand-company">TECHFORB</span>
        </div>
      </section>
      <section class="login-panel" aria-labelledby="login-title">
        <div class="login-card">
          <p class="eyebrow">Gestión de RR.HH</p>
          <h2 id="login-title">Iniciar sesión</h2>
          <p class="intro">Ingresa con tu correo corporativo para continuar.</p>
          @if (error()) {
            <p class="error-alert" role="alert">{{ error() }}</p>
          }
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="field">
              <label for="email">Correo electrónico</label>
              <input id="email" type="email" autocomplete="username" formControlName="email" placeholder="nombre@empresa.com" [attr.aria-invalid]="showError('email')" [attr.aria-describedby]="showError('email') ? 'email-error' : null" />
              @if (showError('email')) {
                <small id="email-error" class="field-error">Ingresa un correo electrónico válido.</small>
              }
            </div>
            <div class="field">
              <label for="password">Contraseña</label>
              <input id="password" type="password" autocomplete="current-password" formControlName="password" placeholder="Ingresa tu contraseña" [attr.aria-invalid]="showError('password')" [attr.aria-describedby]="showError('password') ? 'password-error' : null" />
              @if (showError('password')) {
                <small id="password-error" class="field-error">Ingresa tu contraseña.</small>
              }
            </div>
            <button class="submit-button" type="submit" [disabled]="loading()">{{ loading() ? 'Ingresando…' : 'Ingresar' }}</button>
          </form>
          @if (useMock) {
            <p class="demo-note">Modo de demostración: usa cualquier correo y la contraseña {{ demoPassword }}.</p>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; width: 100%; min-height: 100dvh; font-family: var(--font-family); }
    .login-screen { display: grid; grid-template-columns: 1fr 1fr; width: 100%; min-height: 100dvh; background: var(--surface); }
    .login-brand { display: grid; place-items: center; padding: var(--space-xl); background: var(--primary); color: var(--surface); }
    .brand-content { width: 100%; max-width: 28rem; }
    .brand-mark { display: inline-grid; place-items: center; width: 3rem; height: 3rem; border: 1px solid var(--accent); border-radius: var(--radius); font-weight: 700; }
    .brand-content h1 { margin: var(--space-xl) 0 var(--space-sm); font-size: 2rem; }
    .brand-content p { line-height: 1.6; }
    .brand-company { display: inline-block; margin-top: var(--space-xl); font-weight: 700; letter-spacing: 0.12em; }
    .login-panel { display: grid; place-items: center; padding: var(--space-xl); }
    .login-card { width: 100%; max-width: 25rem; }
    .eyebrow { color: var(--primary); font-weight: 600; }
    .login-card h2 { margin: var(--space-sm) 0; color: var(--text-primary); font-size: 1.5rem; }
    .intro, .demo-note { color: var(--text-secondary); line-height: 1.5; }
    form { display: grid; gap: var(--space-lg); margin-top: var(--space-xl); }
    .field { display: grid; gap: var(--space-sm); }
    label { color: var(--text-primary); font-weight: 600; }
    input { box-sizing: border-box; width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text-primary); font: inherit; }
    input:focus-visible, .submit-button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .field-error { color: var(--error); }
    .error-alert { padding: var(--space-md); border: 1px solid var(--error); border-radius: var(--radius); color: var(--error); }
    .submit-button { padding: 0.8rem; border: 0; border-radius: var(--radius); background: var(--primary); color: var(--surface); font: inherit; font-weight: 600; cursor: pointer; }
    .submit-button:disabled { opacity: 0.65; cursor: wait; }
    .demo-note { margin-top: var(--space-lg); font-size: 0.875rem; }
    @media (max-width: 700px) { .login-screen { grid-template-columns: 1fr; } .login-brand { min-height: 11rem; } .login-panel { padding-block: var(--space-xl); } }
  `]
})
export class LoginPage {
  private readonly builder = inject(NonNullableFormBuilder);
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  readonly returnUrl = input<string>();
  readonly loading = signal(false);
  readonly error = signal('');
  readonly useMock = environment.useMock;
  readonly demoPassword = DEMO_PASSWORD;
  readonly form = this.builder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  showError(field: 'email' | 'password'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.loading()) return;
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
    if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\') || value.startsWith('/login')) return '/';
    return value;
  }
}
