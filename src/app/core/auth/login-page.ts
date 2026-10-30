import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
import './login-page.scss';

/**
 * Pantalla de login para la cuenta administradora de Recursos Humanos de TECHFORB
 * Incluye textos informativos del destino del acceso (HU-026) y aviso para colaboradores
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  readonly fb = new FormBuilder();
  readonly form = this.fb.group({
    email: ['rrhh@techforb.com', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  readonly loading = signal(false);
  readonly loginError = signal<string | null>(null);
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.loginError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { email, password } = this.form.value;
    try {
      await this.auth.login(email ?? '', password ?? '');
      // Redirige a inicio
      this.router.navigateByUrl('/');
    } catch (e: any) {
      // Credenciales incorrectas o error
      this.loginError.set('No pudimos iniciar sesión. El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.');
      this.form.get('password')?.setValue('');
    } finally {
      this.loading.set(false);
    }
  }

  get emailError(): string | null {
    const ctrl = this.form.get('email');
    if (!ctrl || !ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'El correo es obligatorio.';
    if (ctrl.hasError('email')) return 'Debe ingresar un correo electrónico válido.';
    return null;
  }

  get passwordError(): string | null {
    const ctrl = this.form.get('password');
    if (!ctrl || !ctrl.touched) return null;
    if (ctrl.hasError('required')) return 'La contraseña es obligatoria.';
    return null;
  }
}
