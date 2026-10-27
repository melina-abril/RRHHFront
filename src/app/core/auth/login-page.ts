import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorAlert } from 'src/app/shared/components/error-alert';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ErrorAlert],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  /** Estado: cargando o no */
  public isSubmitting = signal(false);
  /** Error del último intento de login */
  public errorMsg = signal<string | null>(null);
  /** Formulario reactivo tipado */
  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor() {
    effect(() => {
      // Si hay sesión, ir a pantalla principal
      if (this.authService.session()) {
        this.router.navigateByUrl('');
      }
    });
  }

  public get email() {
    return this.form.controls.email;
  }
  public get password() {
    return this.form.controls.password;
  }

  public submit(): void {
    if (this.form.invalid || this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.errorMsg.set(null);
    const { email, password } = this.form.value;
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.form.reset();
        this.router.navigateByUrl('');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMsg.set(
          err?.message ?? 'No pudimos iniciar sesión. El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.'
        );
      }
    });
  }
}
