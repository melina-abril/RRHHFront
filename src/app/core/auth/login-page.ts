import { Component, signal, computed, effect } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.scss'],
  imports: [CommonModule],
})
export class LoginPage {
  public loginForm: FormGroup;
  public errorMessage: string | null = null;
  public submitting = false;
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = new FormBuilder();

  constructor() {
    this.loginForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.([a-zA-Z]{2,})$')],
      ],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email')!;
  }
  get password() {
    return this.loginForm.get('password')!;
  }

  public onSubmit() {
    if (this.loginForm.invalid || this.submitting) return;
    this.errorMessage = null;
    this.submitting = true;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl('/');
      },
      error: (err: unknown) => {
        // Mensaje de error genérico (formato de backend: ProblemDetail; modo mock: string)
        this.submitting = false;
        if (typeof err === 'string') {
          this.errorMessage = err;
        } else if (typeof err === 'object' && err !== null && 'message' in err) {
          this.errorMessage = (err as { message: string }).message ?? 'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.';
        } else {
          this.errorMessage = 'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.';
        }
      },
    });
  }
}
