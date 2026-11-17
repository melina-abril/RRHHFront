import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { Employees2Service } from '../../data-access/employees-2.service';
import { EMPLOYEE_DEDICATIONS, EMPLOYEE_STATUSES, EMPLOYEE_WORK_MODES, EmployeeDedication, EmployeeResponse, EmployeeWorkMode, UpdateEmployeeRequest } from '../../models/employees-2.models';

type EditableField = keyof UpdateEmployeeRequest;

@Component({
  selector: 'app-employee-edit-page',
  imports: [ReactiveFormsModule, RouterLink, ErrorAlert, LoadingState],
  templateUrl: './employee-edit-page.html',
  styleUrl: './employee-edit-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeEditPage {
  readonly id = input.required<string>();
  private readonly service = inject(Employees2Service);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly dedications = EMPLOYEE_DEDICATIONS;
  protected readonly workModes = EMPLOYEE_WORK_MODES;
  protected readonly statuses = EMPLOYEE_STATUSES;
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(120)]],
    lastName: ['', [Validators.required, Validators.maxLength(120)]],
    birthDate: ['', Validators.required],
    residenceCountry: ['', [Validators.required, Validators.maxLength(120)]],
    personalEmail: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    dedication: ['FULL_TIME' as EmployeeDedication, Validators.required],
    workMode: ['REMOTE' as EmployeeWorkMode, Validators.required],
    jobRole: ['', [Validators.required, Validators.maxLength(120)]],
  });
  private readonly reloadCount = signal(0);
  protected readonly loadState = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => toLoadState(this.service.getEmployee(id))),
      tap((state) => {
        if (state.status === 'ready') {
          const { firstName, lastName, birthDate, residenceCountry, personalEmail, dedication, workMode, jobRole } = state.data;
          this.form.reset({ firstName, lastName, birthDate, residenceCountry, personalEmail, dedication, workMode, jobRole });
        }
      }),
    ),
    { initialValue: { status: 'loading' } as LoadState<EmployeeResponse> },
  );
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly saved = signal(false);
  private readonly serverErrors = signal<Record<string, string[]>>({});

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.serverErrors.set({}));
  }

  protected errorFor(field: EditableField): string {
    const serverError = this.serverErrors()[field]?.[0];
    if (serverError) return serverError;
    const control = this.form.controls[field];
    if (!control.touched || !control.invalid) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Ingresa un correo válido.';
    return 'Revisa este campo.';
  }

  protected submit(): void {
    this.saved.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const values = this.form.getRawValue();
    const request: UpdateEmployeeRequest = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      residenceCountry: values.residenceCountry.trim(),
      personalEmail: values.personalEmail.trim(),
      jobRole: values.jobRole.trim(),
    };
    if (!request.firstName || !request.lastName || !request.residenceCountry || !request.jobRole) {
      this.form.markAllAsTouched();
      this.submitError.set('Revisa los campos obligatorios.');
      return;
    }
    this.saving.set(true);
    this.submitError.set(null);
    this.service.updateEmployee(this.id(), request).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.submitError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
        this.form.markAllAsTouched();
      },
    });
  }
}
