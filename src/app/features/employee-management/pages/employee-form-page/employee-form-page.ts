import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog';
import { EmployeeManagementService } from '../../data-access/employee-management.service';
import { EmployeeCategory, EmployeeCommitment, EmployeeRequest, EmployeeWorkMode } from '../../models/employee-management.models';

type EmployeeField = keyof EmployeeRequest;

@Component({
  selector: 'app-employee-form-page',
  imports: [ReactiveFormsModule, RouterLink, ErrorAlert, ConfirmDialog],
  templateUrl: './employee-form-page.html',
  styleUrl: './employee-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormPage {
  private readonly service = inject(EmployeeManagementService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly confirmingCancel = signal(false);
  private readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    birthDate: ['', Validators.required],
    residenceCountry: ['', [Validators.required, Validators.maxLength(120)]],
    personalEmail: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    hireDate: ['', Validators.required],
    category: ['PERMANENT' as EmployeeCategory, Validators.required],
    commitment: ['FULL_TIME' as EmployeeCommitment, Validators.required],
    workMode: ['REMOTE' as EmployeeWorkMode, Validators.required],
    jobRole: ['', [Validators.required, Validators.maxLength(120)]],
    clientName: ['', Validators.maxLength(120)],
    projectName: ['', Validators.maxLength(120)],
    contactName: ['', Validators.maxLength(120)],
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (Object.keys(this.serverErrors()).length) this.serverErrors.set({});
    });
  }

  protected errorFor(field: EmployeeField): string {
    const serverMessage = this.serverErrors()[field]?.[0];
    if (serverMessage) return serverMessage;
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Ingresa un correo válido.';
    if (control.hasError('maxlength')) return 'El texto es demasiado largo.';
    return 'Revisa este campo.';
  }

  protected submit(): void {
    if (this.saving()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const optional = (text: string): string | null => text.trim() || null;
    const request: EmployeeRequest = {
      ...value,
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      residenceCountry: value.residenceCountry.trim(),
      personalEmail: value.personalEmail.trim(),
      jobRole: value.jobRole.trim(),
      clientName: optional(value.clientName),
      projectName: optional(value.projectName),
      contactName: optional(value.contactName),
    };
    this.saving.set(true);
    this.submitError.set(null);
    this.serverErrors.set({});
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

  protected cancel(): void {
    this.confirmingCancel.set(false);
    void this.router.navigate(['..'], { relativeTo: this.route });
  }
}
