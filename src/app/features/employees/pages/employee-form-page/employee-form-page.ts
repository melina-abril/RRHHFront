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
import { EmployeeDto, EmployeeRequest } from '../../models/employees.models';

type EmployeeField = keyof EmployeeRequest;

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
    firstName: ['', [Validators.required, Validators.maxLength(60)]],
    lastName: ['', [Validators.required, Validators.maxLength(60)]],
    documentType: ['', [Validators.required, Validators.maxLength(20)]],
    documentNumber: ['', [Validators.required, Validators.maxLength(30)]],
    birthDate: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.maxLength(30)],
    hireDate: ['', Validators.required],
    departmentId: ['', [Validators.required, Validators.maxLength(30)]],
    positionId: ['', [Validators.required, Validators.maxLength(30)]],
    managerId: [''],
  });
  protected readonly loadState = toSignal(
    toObservable(this.id).pipe(
      switchMap((id): Observable<LoadState<EmployeeDto | null>> => id ? toLoadState<EmployeeDto | null>(this.service.getEmployeeById(id)) : of<LoadState<EmployeeDto | null>>({ status: 'ready', data: null })),
      tap((state) => {
        if (state.status === 'ready' && state.data) this.form.reset(this.formValue(state.data));
      }),
    ),
    { initialValue: { status: 'loading' } as LoadState<EmployeeDto | null> },
  );
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  private readonly serverErrors = signal<Record<string, string[]>>({});

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(() => this.serverErrors.set({}));
  }

  protected errorFor(field: EmployeeField): string {
    const server = this.serverErrors()[field]?.[0];
    if (server) return server;
    const control = this.form.controls[field];
    if (!control.touched || control.valid || !control.errors) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('email')) return 'Ingresa un correo válido.';
    return 'Revisa este campo.';
  }

  protected submit(): void {
    if (this.saving()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const request: EmployeeRequest = {
      ...raw,
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      documentType: raw.documentType.trim(),
      documentNumber: raw.documentNumber.trim(),
      email: raw.email.trim(),
      phone: raw.phone.trim(),
      departmentId: raw.departmentId.trim(),
      positionId: raw.positionId.trim(),
      managerId: raw.managerId.trim() || null,
    };
    const id = this.id();
    this.saving.set(true);
    this.submitError.set(null);
    (id ? this.service.updateEmployee(id, request) : this.service.createEmployee(request)).subscribe({
      next: (employee) => void this.router.navigate(id ? ['..'] : ['..', employee.id], { relativeTo: this.route }),
      error: (error: unknown) => {
        this.saving.set(false);
        this.submitError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
        this.form.markAllAsTouched();
      },
    });
  }

  private formValue(employee: EmployeeDto): Record<EmployeeField, string> {
    return {
      firstName: employee.firstName,
      lastName: employee.lastName,
      documentType: employee.documentType,
      documentNumber: employee.documentNumber,
      birthDate: employee.birthDate ?? '',
      email: employee.email,
      phone: employee.phone,
      hireDate: employee.hireDate ?? '',
      departmentId: employee.departmentId,
      positionId: employee.positionId,
      managerId: employee.managerId ?? '',
    };
  }
}
