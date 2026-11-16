import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { EmployeesService } from '../../data-access/employees.service';
import { EmployeeRequest } from '../../models/employees.models';

type EmployeeField = keyof EmployeeRequest;

const VALIDATION_MESSAGES: Record<string, string> = {
  required: 'Este campo es obligatorio.',
  email: 'Ingresa un correo personal válido.',
  maxlength: 'El texto es demasiado largo.',
};

@Component({
  selector: 'app-employee-form-page',
  imports: [ReactiveFormsModule, RouterLink, ErrorAlert],
  templateUrl: './employee-form-page.html',
  styleUrl: './employee-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormPage {
  private readonly service = inject(EmployeesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly activeSection = signal('personal');
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  private readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    birthDate: ['', Validators.required],
    residenceCountry: ['', [Validators.required, Validators.maxLength(100)]],
    personalEmail: ['', [Validators.required, Validators.email]],
    startDate: ['', Validators.required],
    category: ['', Validators.required],
    dedication: ['', Validators.required],
    workMode: ['', Validators.required],
    jobRole: ['', [Validators.required, Validators.maxLength(120)]],
    initialClient: ['', Validators.maxLength(120)],
    initialProject: ['', Validators.maxLength(120)],
    initialManager: ['', Validators.maxLength(120)],
  });

  protected scrollTo(section: string): void {
    this.activeSection.set(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    const values = this.form.getRawValue();
    const request: EmployeeRequest = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      birthDate: values.birthDate,
      residenceCountry: values.residenceCountry.trim(),
      personalEmail: values.personalEmail.trim(),
      startDate: values.startDate,
      category: values.category as EmployeeRequest['category'],
      dedication: values.dedication as EmployeeRequest['dedication'],
      workMode: values.workMode as EmployeeRequest['workMode'],
      jobRole: values.jobRole.trim(),
      initialClient: values.initialClient.trim() || null,
      initialProject: values.initialProject.trim() || null,
      initialManager: values.initialManager.trim() || null,
    };
    this.saving.set(true);
    this.submitError.set(null);
    this.serverErrors.set({});
    this.service.create(request).subscribe({
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
