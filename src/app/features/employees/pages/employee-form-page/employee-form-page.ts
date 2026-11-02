import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, Observable, of, tap } from 'rxjs';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadState } from '../../../../shared/models/load-state';
import { EmployeesService } from '../../data-access/employees.service';
import { Employee, EmployeeRequest } from '../../models/employees.models';

@Component({
  selector: 'app-employee-form-page',
  imports: [ReactiveFormsModule, RouterLink, PageHeader, ErrorAlert],
  templateUrl: './employee-form-page.html',
  styleUrl: './employee-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormPage {
  readonly id = input<string>(); // undefined en alta
  private readonly employeesService = inject(EmployeesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly isEdit = computed(() => !!this.id());
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  private readonly serverErrors = signal<Record<string, string[]>>({});

  protected readonly form = inject(NonNullableFormBuilder).group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    documentType: ['', [Validators.required, Validators.maxLength(10)]],
    documentNumber: ['', [Validators.required, Validators.maxLength(20)]],
    birthDate: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    hireDate: ['', [Validators.required]],
    departmentId: ['', [Validators.required]],
    positionId: ['', [Validators.required]],
    managerId: [''],
  });

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed(inject(DestroyRef))).subscribe(() => {
      if (Object.keys(this.serverErrors()).length) this.serverErrors.set({});
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request: EmployeeRequest = { ...this.form.getRawValue() };
    const id = this.id();
    this.saving.set(true);
    this.submitError.set(null);
    (id ? this.employeesService.update(id, request) : this.employeesService.create(request)).subscribe({
      next: (employee) => void this.router.navigate(id ? ['..'] : ['..', employee.id], { relativeTo: this.route }),
      error: (error: unknown) => {
        this.saving.set(false);
        this.submitError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
        this.form.markAllAsTouched();
      },
    });
  }

  protected errorFor(field: keyof EmployeeRequest): string {
    const server = this.serverErrors()[field]?.[0];
    if (server) return server;
    const control = this.form.controls[field];
    if (!control.touched || control.valid || !control.errors) return '';
    let key = Object.keys(control.errors)[0];
    switch (key) {
      case 'required': return 'Este campo es obligatorio.';
      case 'maxlength': return 'Demasiado largo.';
      case 'email': return 'Ingresa un correo válido.';
      default: return 'Revisa este campo.';
    }
  }
}
