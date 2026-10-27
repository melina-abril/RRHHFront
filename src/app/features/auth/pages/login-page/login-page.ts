import { Component, signal, effect } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../data-access/auth.service';
import { LoginRequest } from '../../models/auth.models';

@Component({
  selector: 'auth-login-page',
  standalone: true,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  imports: [ReactiveFormsModule, ]
})
export class LoginPage {
  /** Formulario reactivo tipado */
  public loginForm: FormGroup;
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private api: AuthApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email]
      ],
      password: ['', [Validators.required]]
    });
  }

  public submit(): void {
    this.errorMessage.set(null);
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const request: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    this.api.login(request).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.errorMessage.set(null);
        // Redirige a pantalla principal (layout autenticado): ''
        this.router.navigateByUrl('');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.message || 'No pudimos iniciar sesión.');
      }
    });
  }

  public formControl(name: string) {
    return this.loginForm.get(name)!;
  }
}
