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
    <main class="login">
      <section class="login__panel" aria-labelledby="brand-title">
        <div class="login__brand">TECHFORB</div>
        <div class="login__intro">
          <h1 id="brand-title">Gestión de RR.HH</h1>
          <p>Un espacio para organizar la gestión de Recursos Humanos.</p>
        </div>
      </section>
      <section class="login__form-panel" aria-labelledby="login-title">
        <div class="login__form-content">
          <h2 id="login-title">Iniciar sesión</h2>
          <p class="login__description">Ingresa con tu correo corporativo para continuar.</p>
          @if (error()) {
            <p class="login__error" role="alert">{{ error() }}</p>
          }
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <div class="login__field">
              <label for="login-email">Correo corporativo</label>
              <input id="login-email" type="email" autocomplete="username" formControlName="email" [attr.aria-invalid]="showError('email')" [attr.aria-describedby]="showError('email') ? 'login-email-error' : null" />
              @if (showError('email')) {
                <span id="login-email-error" class="login__field-error">Ingresa un correo válido.</span>
              }
            </div>
            <div class="login__field">
              <label for="login-password">Contraseña</label>
              <input id="login-password" type="password" autocomplete="current-password" formControlName="password" [attr.aria-invalid]="showError('password')" [attr.aria-describedby]="showError('password') ? 'login-password-error' : null" />
              @if (showError('password')) {
                <span id="login-password-error" class="login__field-error">Ingresa tu contraseña.</span>
              }
            </div>
            <button class="login__submit" type="submit" [disabled]="loading()">{{ loading() ? 'Ingresando…' : 'Ingresar' }}</button>
          </form>
          @if (useMock) {
            <p class="login__demo">Modo demostración: usa tu correo y la contraseña {{ demoPassword }}.</p>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; width: 100%; min-height: 100dvh; font-family: var(--font-family); color: var(--text-primary); }
    .login { display: grid; grid-template-columns: 1fr 1fr; width: 100%; min-height: 100dvh; background: var(--surface); }
    .login__panel { display: flex; flex-direction: column; justify-content: space-between; padding: clamp(2rem, 5vw, 5rem); background: var(--primary); color: var(--surface); }
    .login__brand { font-size: 1.125rem; font-weight: 700; letter-spacing: 0.08em; }
    .login__intro { max-width: 30rem; }
    .login__intro h1 { font-size: clamp(2rem, 3vw, 3rem); line-height: 1.15; }
    .login__intro p { font-size: 1rem; line-height: 1.6; }
    .login__form-panel { display: grid; place-items: center; padding: 2rem; }
    .login__form-content { width: 100%; max-width: 25rem; }
    .login__form-content h2 { margin: 0 0 0.5rem; font-size: 1.5rem; }
    .login__description { margin: 0 0 2rem; color: var(--text-secondary); }
    .login__field { display: grid; gap: 0.5rem; margin-bottom: 1.25rem; }
    .login__field label { font-weight: 600; font-size: 0.875rem; }
    .login__field input { width: 100%; box-sizing: border-box; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text-primary); font: inherit; }
    .login__field input:focus-visible, .login__submit:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .login__field-error, .login__error { color: var(--error); font-size: 0.875rem; }
    .login__error { padding: 0.75rem; border: 1px solid var(--error); border-radius: var(--radius); }
    .login__submit { width: 100%; padding: 0.8rem; border: 0; border-radius: var(--radius); background: var(--primary); color: var(--surface); font: inherit; font-weight: 600; cursor: pointer; }
    .login__submit:disabled { opacity: 0.7; cursor: wait; }
    .login__demo { margin-top: 1.5rem; padding: 1rem; border-radius: var(--radius); background: var(--soft-background); color: var(--text-secondary); font-size: 0.875rem; }
    @media (max-width: 700px) { .login { grid-template-columns: 1fr; } .login__panel { gap: 1rem; padding: 2rem; } .login__intro h1 { margin-bottom: 0.5rem; } .login__form-panel { padding: 3rem 1.5rem; } }
  `]
})
export class LoginPage {
  private readonly builder = inject(NonNullableFormBuilder);
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  readonly returnUrl = input<string>();
  readonly error = signal('');
  readonly loading = signal(false);
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
    this.error.set('');
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();
    this.currentUser.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl(this.safeReturnUrl(this.returnUrl()));
      },
      error: (failure: unknown) => {
        this.error.set(errorMessage(failure));
        this.loading.set(false);
      }
    });
  }

  private safeReturnUrl(value: string | undefined): string {
    return value?.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') && !value.includes('\\') ? value : '/';
  }
}
