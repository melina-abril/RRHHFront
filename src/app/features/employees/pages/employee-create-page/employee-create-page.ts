import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { EmployeesService } from '../../data-access/employees.service';
import { CreateEmployeeRequest, EMPLOYEE_CATEGORY_OPTIONS, EmployeeCategory } from '../../models/employees.models';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';

@Component({
  selector: 'app-employee-create-page',
  imports: [ReactiveFormsModule, RouterLink, PageHeader, LoadingState, ErrorAlert],
  templateUrl: './employee-create-page.html',
  styleUrl: './employee-create-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCreatePage {
  private readonly employeesService = inject(EmployeesService);
  private readonly router = inject(Router);

  protected readonly categoryOptions = EMPLOYEE_CATEGORY_OPTIONS;

  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  private readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    category: [null as EmployeeCategory | null, [Validators.required]],
    countryCode: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    city: ['', [Validators.required, Validators.maxLength(60)]],
    entryDate: ['', [Validators.required]],
    position: ['', [Validators.required, Validators.maxLength(100)]],
    clients: [[] as string[]],
    projects: [[] as string[]],
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(() => {
      if (Object.keys(this.serverErrors()).length) this.serverErrors.set({});
    });
  }

  protected errorFor(field: keyof CreateEmployeeRequest): string {
    const server = this.serverErrors()[field]?.[0];
    if (server) return server;
    const control = this.form.controls[field];
    if (!control.touched || control.valid || !control.errors) return '';
    const key = Object.keys(control.errors)[0];
    switch (key) {
      case 'required': return 'Este campo es obligatorio.';
      case 'email': return 'Ingresa un correo válido.';
      case 'minlength': return 'El valor es muy corto.';
      case 'maxlength': return 'El valor es muy largo.';
      default: return 'Revisa este campo.';
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const request: CreateEmployeeRequest = {
      ...raw,
      clients: raw.clients || [],
      projects: raw.projects || [],
    };
    this.saving.set(true);
    this.submitError.set(null);
    this.employeesService.create(request).subscribe({
      next: (created) => void this.router.navigate(['..', created.id]),
      error: (error: unknown) => {
        this.saving.set(false);
        this.submitError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
        this.form.markAllAsTouched();
      },
    });
  }
}
