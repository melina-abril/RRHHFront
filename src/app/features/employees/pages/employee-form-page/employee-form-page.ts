import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of, switchMap, tap } from 'rxjs';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeesService } from '../../data-access/employees.service';
import { Employee, EmployeeCategory, EmployeeCreateRequest, EmployeeDedication, EmployeeUpdateRequest, EmployeeWorkMode } from '../../models/employees.models';

type EditableField = keyof EmployeeUpdateRequest;
type FormField = EditableField | 'startDate' | 'category';

@Component({
  selector: 'app-employee-form-page',
  imports: [ReactiveFormsModule, RouterLink, ErrorAlert, LoadingState],
  templateUrl: './employee-form-page.html',
  styleUrl: './employee-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormPage {
  readonly id = input<string>();
  private readonly service = inject(EmployeesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly isEdit = computed(() => !!this.id());
  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    birthDate: ['', Validators.required],
    residenceCountry: ['', [Validators.required, Validators.maxLength(100)]],
    personalEmail: ['', [Validators.required, Validators.email]],
    dedication: ['FULL_TIME' as EmployeeDedication, Validators.required],
    workMode: ['REMOTE' as EmployeeWorkMode, Validators.required],
    jobRole: ['', [Validators.required, Validators.maxLength(120)]],
    startDate: ['', Validators.required],
    category: ['PERMANENT' as EmployeeCategory, Validators.required],
    initialClient: [''], initialProject: [''], initialManager: [''],
  });
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  private readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly loadState = toSignal(
    toObservable(this.id).pipe(
      switchMap((id): Observable<LoadState<Employee>> => id ? toLoadState(this.service.get(id)) : of<LoadState<Employee>>({ status: 'empty' })),
      tap(state => {
        if (state.status === 'ready') {
          const employee = state.data;
          this.form.reset({ ...employee, initialClient: employee.initialClient ?? '', initialProject: employee.initialProject ?? '', initialManager: employee.initialManager ?? '' });
        }
      }),
    ),
    { initialValue: { status: 'loading' } as LoadState<Employee> },
  );

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(() => {
      if (Object.keys(this.serverErrors()).length) this.serverErrors.set({});
    });
  }

  protected errorFor(field: FormField): string {
    const server = this.serverErrors()[field]?.[0];
    if (server) return server;
    const control = this.form.controls[field];
    if (!control.touched || !control.errors) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Ingresa un correo válido.';
    return 'Revisa este campo.';
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const request: EmployeeUpdateRequest = {
      firstName: value.firstName.trim(), lastName: value.lastName.trim(), birthDate: value.birthDate,
      residenceCountry: value.residenceCountry.trim(), personalEmail: value.personalEmail.trim(),
      dedication: value.dedication, workMode: value.workMode, jobRole: value.jobRole.trim(),
    };
    const id = this.id();
    const operation = id
      ? this.service.update(id, request)
      : this.service.create({ ...request, startDate: value.startDate, category: value.category, initialClient: value.initialClient.trim() || null, initialProject: value.initialProject.trim() || null, initialManager: value.initialManager.trim() || null } satisfies EmployeeCreateRequest);
    this.saving.set(true);
    this.submitError.set(null);
    operation.subscribe({
      next: employee => void this.router.navigate(id ? ['..'] : ['..', employee.id], { relativeTo: this.route }),
      error: (error: unknown) => {
        this.saving.set(false);
        this.submitError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
        this.form.markAllAsTouched();
      },
    });
  }
}
