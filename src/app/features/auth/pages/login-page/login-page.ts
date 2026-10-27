import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthFeatureService } from '../../data-access/auth.service';
import { LoginRequest } from '../../models/auth.models';

@Component({
  selector: 'app-auth-login-page',
  standalone: true,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginPage {
  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  protected submitted = false;
  protected submitting = false;
  protected loginError: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthFeatureService,
    private readonly router: Router
  ) {}

  public onSubmit(): void {
    this.submitted = true;
    this.loginError = null;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const values = this.form.value as LoginRequest;
    this.auth.login(values).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.submitting = false;
        this.loginError = err?.message || 'No pudimos iniciar sesión.';
      }
    });
  }
}
