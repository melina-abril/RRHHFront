import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  public loading = signal(false);
  public errorMessage = signal<string | null>(null);

  // Al enviar el formulario:
  public onSubmit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: () => {
        // Navega a inicio luego de login exitoso
        this.router.navigateByUrl('/inicio');
      },
      error: err => {
        this.errorMessage.set(err?.message || 'El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.');
        this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  }
}
