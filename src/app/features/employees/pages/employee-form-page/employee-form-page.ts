import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { EmployeesService } from '../../data-access/employees.service';
import { EmployeeCategory, EmployeeDedication, EmployeeRequest, EmployeeWorkMode } from '../../models/employees.models';

type EmployeeField = keyof EmployeeRequest;
type FormSection = 'personal' | 'contact' | 'labor' | 'corporate' | 'assignment';

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
  protected readonly activeSection = signal<FormSection>('personal');
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

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (Object.keys(this.serverErrors()).length) this.serverErrors.set({});
    });
  }

  protected scrollTo(section: FormSection): void {
    this.activeSection.set(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

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
    if (this.saving()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const values = this.form.getRawValue();
    if (!values.category || !values.dedication || !values.workMode) {
      this.form.markAllAsTouched();
      return;
    }
    if (values.birthDate >= values.startDate) {
      this.serverErrors.set({ startDate: ['La fecha de ingreso debe ser posterior a la fecha de nacimiento.'] });
      this.form.controls.startDate.markAsTouched();
      return;
    }
    const request: EmployeeRequest = {
      firstName: values.firstName.trim(), lastName: values.lastName.trim(), birthDate: values.birthDate,
      residenceCountry: values.residenceCountry.trim(), personalEmail: values.personalEmail.trim().toLowerCase(),
      startDate: values.startDate, category: values.category, dedication: values.dedication,
      workMode: values.workMode, jobRole: values.jobRole.trim(),
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
