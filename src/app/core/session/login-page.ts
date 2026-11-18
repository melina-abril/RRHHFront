import { Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { errorMessage } from '../http/api-error';
import { CurrentUser, DEMO_PASSWORD } from './current-user';

function safeReturnUrl(value: string | undefined): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return '/';
  }
  return value;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <main class="login-page">
      <section class="login-panel" aria-labelledby="login-title">
        <div class="login-brand">Gestión de RR.HH</div>
        <h1 id="login-title">Iniciar sesión</h1>
        <p>Ingresa con tu correo corporativo para acceder al panel de Recursos Humanos.</p>

        @if (demoMode) {
          <p class="demo-notice">Modo de demostración: usa cualquier correo válido y la contraseña {{ demoPassword }}.</p>
        }
        @if (error()) {
          <p class="login-error" role="alert">{{ error() }}</p>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="field">
            <label for="login-email">Correo corporativo</label>
            <input id="login-email" type="email" formControlName="email" autocomplete="username" [attr.aria-invalid]="showError() && form.controls.email.invalid" [attr.aria-describedby]="showError() && form.controls.email.invalid ? 'email-error' : null" />
            @if (showError() && form.controls.email.invalid) {
              <span id="email-error" class="field-error">Ingresa un correo válido.</span>
            }
          </div>
          <div class="field">
            <label for="login-password">Contraseña</label>
            <input id="login-password" type="password" formControlName="password" autocomplete="current-password" [attr.aria-invalid]="showError() && form.controls.password.invalid" [attr.aria-describedby]="showError() && form.controls.password.invalid ? 'password-error' : null" />
            @if (showError() && form.controls.password.invalid) {
              <span id="password-error" class="field-error">Ingresa tu contraseña.</span>
            }
          </div>
          <button type="submit" [disabled]="loading()">{{ loading() ? 'Ingresando…' : 'Ingresar' }}</button>
        </form>
      </section>
    </main>
  `,
  styles: [`
    .login-page { display: grid; place-items: center; width: 100%; min-height: 100dvh; padding: var(--space-md); background: var(--background); }
    .login-panel { width: 100%; max-width: 400px; padding: var(--space-xl); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); }
    .login-brand { color: var(--primary); font-weight: 700; }
    h1 { margin: var(--space-lg) 0 var(--space-xs); color: var(--text-primary); font-size: 1.5rem; }
    p { color: var(--text-secondary); line-height: 1.5; }
    .demo-notice { padding: var(--space-sm); border-radius: var(--radius); background: var(--soft-background); color: var(--primary); }
    .login-error { padding: var(--space-sm); border: 1px solid var(--error); border-radius: var(--radius); color: var(--error); }
    form { display: grid; gap: var(--space-md); margin-top: var(--space-lg); }
    .field { display: grid; gap: var(--space-xs); }
    label { color: var(--text-primary); font-weight: 600; }
    input { width: 100%; padding: var(--space-sm); border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); color: var(--text-primary); font: inherit; }
    input:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    .field-error { color: var(--error); font-size: 0.875rem; }
    button { padding: var(--space-sm) var(--space-md); border: 0; border-radius: var(--radius); background: var(--primary); color: var(--surface); font: inherit; font-weight: 600; cursor: pointer; }
    button:disabled { cursor: wait; opacity: 0.65; }
  `],
})
export class LoginPage {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  readonly returnUrl = input<string>();
  protected readonly demoMode = environment.useMock;
  protected readonly demoPassword = DEMO_PASSWORD;
  protected readonly error = signal('');
  protected readonly loading = signal(false);
  protected readonly showError = signal(false);
  protected readonly form = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected submit(): void {
    this.showError.set(true);
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.loading.set(true);
    const { email, password } = this.form.getRawValue();
    this.currentUser.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        void this.router.navigateByUrl(safeReturnUrl(this.returnUrl()));
      },
      error: (cause: unknown) => {
        this.loading.set(false);
        this.error.set(errorMessage(cause));
      },
    });
  }
}
