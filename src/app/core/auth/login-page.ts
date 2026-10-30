import { Component, signal, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Pantalla de inicio de sesión para el administrador de RR.HH.
 * Aplica layout, avisos y leyendas según lo definido y utiliza la guía de estilos y branding.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginPage {

  readonly form = inject(FormBuilder).group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  loading = signal(false);
  loginFailed = signal(false);
  showErrors = signal(false);

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  async onSubmit(): Promise<void> {
    this.showErrors.set(true);
    if (this.form.invalid) {
      return;
    }
    this.loading.set(true);
    this.loginFailed.set(false);
    try {
      await this.auth.login(this.form.value.email, this.form.value.password);
      this.router.navigateByUrl('/');
    } catch (_e) {
      this.loginFailed.set(true);
    } finally {
      this.loading.set(false);
    }
  }
}
