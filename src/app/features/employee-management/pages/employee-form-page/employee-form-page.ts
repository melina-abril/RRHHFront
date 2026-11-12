import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { EmployeeManagementService } from '../../data-access/employee-management.service';
import { EmployeeCategory, EmployeeCommitment, EmployeeRequest, EmployeeWorkMode } from '../../models/employee-management.models';

type EmployeeField = keyof EmployeeRequest;

const VALIDATION_MESSAGES: Record<string, string> = {
  required: 'Este campo es obligatorio.',
  email: 'Ingresa un correo electrónico válido.',
  maxlength: 'El texto es demasiado largo.',
  pattern: 'Ingresa una fecha válida en formato AAAA-MM-DD.',
};

@Component({
  selector: 'app-employee-form-page',
  imports: [ReactiveFormsModule, RouterLink, ErrorAlert],
  templateUrl: './employee-form-page.html',
  styleUrl: './employee-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormPage {
  private readonly service = inject(EmployeeManagementService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    birthDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
    residenceCountry: ['', [Validators.required, Validators.maxLength(120)]],
    personalEmail: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    hireDate: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}$/)]],
    category: ['' as EmployeeCategory | '', [Validators.required]],
    commitment: ['' as EmployeeCommitment | '', [Validators.required]],
    workMode: ['' as EmployeeWorkMode | '', [Validators.required]],
    jobRole: ['', [Validators.required, Validators.maxLength(120)]],
    clientName: ['', [Validators.maxLength(120)]],
    projectName: ['', [Validators.maxLength(120)]],
    contactName: ['', [Validators.maxLength(120)]],
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(() => {
      if (Object.keys(this.serverErrors()).length) this.serverErrors.set({});
    });
  }

  protected errorFor(field: EmployeeField): string {
    const server = this.serverErrors()[field]?.[0];
    if (server) return server;
    const control = this.form.controls[field];
    if (!control.touched || control.valid || !control.errors) return '';
    const key = Object.keys(control.errors)[0];
    return VALIDATION_MESSAGES[key] ?? 'Revisa este campo.';
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (!value.category || !value.commitment || !value.workMode) {
      this.form.markAllAsTouched();
      return;
    }
    const request: EmployeeRequest = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      birthDate: value.birthDate,
      residenceCountry: value.residenceCountry.trim(),
      personalEmail: value.personalEmail.trim(),
      hireDate: value.hireDate,
      category: value.category,
      commitment: value.commitment,
      workMode: value.workMode,
      jobRole: value.jobRole.trim(),
      clientName: value.clientName.trim() || null,
      projectName: value.projectName.trim() || null,
      contactName: value.contactName.trim() || null,
    };
    this.saving.set(true);
    this.submitError.set(null);
    this.service.createEmployee(request).subscribe({
      next: (employee) => void this.router.navigate(['..', employee.id], { relativeTo: this.route }),
      error: (error: unknown) => {
        this.saving.set(false);
        this.submitError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
        this.form.markAllAsTouched();
      },
    });
  }
}
