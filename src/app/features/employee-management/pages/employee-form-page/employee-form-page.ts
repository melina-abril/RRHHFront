import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { EmployeeManagementService } from '../../data-access/employee-management.service';
import { EMPLOYEE_CATEGORIES, EMPLOYEE_COMMITMENTS, EMPLOYEE_WORK_MODES, EmployeeCategory, EmployeeCommitment, EmployeeRequest, EmployeeWorkMode } from '../../models/employee-management.models';

type RequiredField = 'firstName' | 'lastName' | 'birthDate' | 'residenceCountry' | 'personalEmail' | 'hireDate' | 'category' | 'commitment' | 'workMode' | 'jobRole';
type OptionalField = 'clientName' | 'projectName' | 'contactName';
type EmployeeField = RequiredField | OptionalField;

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
  protected readonly categories = EMPLOYEE_CATEGORIES;
  protected readonly commitments = EMPLOYEE_COMMITMENTS;
  protected readonly workModes = EMPLOYEE_WORK_MODES;
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  private readonly serverErrors = signal<Record<string, string[]>>({});

  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    birthDate: ['', Validators.required],
    residenceCountry: ['', Validators.required],
    personalEmail: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    hireDate: ['', Validators.required],
    category: ['' as EmployeeCategory | '', Validators.required],
    commitment: ['' as EmployeeCommitment | '', Validators.required],
    workMode: ['' as EmployeeWorkMode | '', Validators.required],
    jobRole: ['', [Validators.required, Validators.maxLength(120)]],
    clientName: [''],
    projectName: [''],
    contactName: [''],
  });

  protected errorFor(field: EmployeeField): string {
    const serverError = this.serverErrors()[field]?.[0];
    if (serverError) return serverError;
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Ingresa un correo electrónico válido.';
    if (control.hasError('maxlength')) return 'El texto es demasiado largo.';
    return 'Revisa este campo.';
  }

  protected submit(): void {
    if (this.saving()) return;
    this.serverErrors.set({});
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
      firstName: value.firstName.trim(), lastName: value.lastName.trim(),
      birthDate: value.birthDate, residenceCountry: value.residenceCountry.trim(),
      personalEmail: value.personalEmail.trim(), hireDate: value.hireDate,
      category: value.category, commitment: value.commitment, workMode: value.workMode,
      jobRole: value.jobRole.trim(), clientName: value.clientName.trim() || null,
      projectName: value.projectName.trim() || null, contactName: value.contactName.trim() || null,
    };
    this.saving.set(true);
    this.submitError.set(null);
    this.service.createEmployee(request).subscribe({
      next: (employee) => void this.router.navigate(['..', employee.id], { relativeTo: this.route }),
      error: (error: unknown) => {
        this.saving.set(false);
        this.submitError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
      },
    });
  }
}
