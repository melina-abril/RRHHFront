import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { EmployeesService } from '../../data-access/employees.service';
import { EmployeeCategory, EmployeeDedication, EmployeeRequest, EmployeeWorkMode } from '../../models/employees.models';

type EmployeeField = keyof EmployeeRequest;

@Component({
  selector: 'app-employee-form-page',
  imports: [ReactiveFormsModule, RouterLink, ErrorAlert],
  templateUrl: './employee-form-page.html',
  styleUrl: './employee-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormPage {
  private readonly employeesService = inject(EmployeesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  private readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    birthDate: ['', Validators.required],
    residenceCountry: ['', [Validators.required, Validators.maxLength(100)]],
    personalEmail: ['', [Validators.required, Validators.email]],
    startDate: ['', Validators.required],
    category: ['' as EmployeeCategory | '', Validators.required],
    dedication: ['' as EmployeeDedication | '', Validators.required],
    workMode: ['' as EmployeeWorkMode | '', Validators.required],
    jobRole: ['', [Validators.required, Validators.maxLength(120)]],
    initialClient: ['', Validators.maxLength(120)],
    initialProject: ['', Validators.maxLength(120)],
    initialManager: ['', Validators.maxLength(120)],
  });

  protected errorFor(field: EmployeeField): string {
    const server = this.serverErrors()[field]?.[0];
    if (server) return server;
    const control = this.form.controls[field];
    if (!control.touched || control.valid || !control.errors) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Ingresa un correo válido.';
    if (control.hasError('maxlength')) return 'El texto es demasiado largo.';
    return 'Revisa este campo.';
  }

  protected submit(): void {
    this.serverErrors.set({});
    this.submitError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    if (value.birthDate >= value.startDate) {
      this.serverErrors.set({ startDate: ['La fecha de ingreso debe ser posterior a la fecha de nacimiento.'] });
      this.form.controls.startDate.markAsTouched();
      return;
    }
    if (!value.category || !value.dedication || !value.workMode) {
      this.form.markAllAsTouched();
      return;
    }
    const request: EmployeeRequest = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      birthDate: value.birthDate,
      residenceCountry: value.residenceCountry.trim(),
      personalEmail: value.personalEmail.trim(),
      startDate: value.startDate,
      category: value.category,
      dedication: value.dedication,
      workMode: value.workMode,
      jobRole: value.jobRole.trim(),
      initialClient: value.initialClient.trim() || null,
      initialProject: value.initialProject.trim() || null,
      initialManager: value.initialManager.trim() || null,
    };
    this.saving.set(true);
    this.employeesService.create(request).subscribe({
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
