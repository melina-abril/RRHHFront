import { Component, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginPage {
  protected form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  get email() { return this.form.controls['email']; }
  get password() { return this.form.controls['password']; }

  protected onSubmit(): void {
    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).then(
      () => {
        this.loading.set(false);
        this.router.navigateByUrl('/');
      },
      (err: any) => {
        this.loading.set(false);
        if (err === 'unauthorized' || (err?.status === 401)) {
          this.error.set('unauthorized');
        } else if (typeof err === 'string') {
          this.error.set(err);
        } else if (err && err.error && typeof err.error.detail === 'string') {
          this.error.set(err.error.detail);
        } else {
          this.error.set('Ocurrió un error inesperado.');
        }
      }
    );
  }
}
