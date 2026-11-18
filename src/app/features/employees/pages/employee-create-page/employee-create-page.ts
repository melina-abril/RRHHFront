import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { EmployeesService } from '../../data-access/employees.service';
import { EmployeeCategory, EmployeeCreateRequest } from '../../models/employees.models';

type EmployeeField = 'firstName' | 'lastName' | 'email' | 'category' | 'country' | 'position' | 'hireDate';

@Component({
  selector: 'app-employee-create-page',
  imports: [ReactiveFormsModule, RouterLink, ErrorAlert],
  templateUrl: './employee-create-page.html',
  styleUrl: './employee-create-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCreatePage {
  private readonly service = inject(EmployeesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly activeSection = signal('personal');
  private readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    category: ['' as EmployeeCategory | '', Validators.required],
    country: ['', [Validators.required, Validators.maxLength(100)]],
    position: ['', [Validators.required, Validators.maxLength(120)]],
    clientName: ['', Validators.maxLength(120)],
    projectName: ['', Validators.maxLength(120)],
    hireDate: ['', Validators.required],
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(() => this.serverErrors.set({}));
  }

  protected errorFor(field: EmployeeField): string {
    const server = this.serverErrors()[field]?.[0];
    if (server) return server;
    const control = this.form.controls[field];
    if (!control.touched || control.valid) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Ingresa un correo válido.';
    return 'Revisa este campo.';
  }

  protected scrollTo(id: string): void {
    this.activeSection.set(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected submit(): void {
    if (this.saving()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (!value.category) return;
    const request: EmployeeCreateRequest = {
      firstName: value.firstName.trim(), lastName: value.lastName.trim(), email: value.email.trim(),
      category: value.category, country: value.country.trim(), position: value.position.trim(),
      clientNames: value.clientName.trim() ? [value.clientName.trim()] : [],
      projectNames: value.projectName.trim() ? [value.projectName.trim()] : [],
      hireDate: value.hireDate,
    };
    this.saving.set(true);
    this.submitError.set(null);
    this.service.createEmployee(request).subscribe({
      next: employee => void this.router.navigate(['..', employee.id], { relativeTo: this.route }),
      error: (error: unknown) => {
        this.saving.set(false);
        this.submitError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
        this.form.markAllAsTouched();
      },
    });
  }
}
