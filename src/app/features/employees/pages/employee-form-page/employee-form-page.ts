import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeesService } from '../../data-access/employees.service';
import { Employee, EmployeeCategory, EMPLOYEE_CATEGORY_OPTIONS } from '../../models/employees.models';
import { PageHeader } from '../../../../shared/components/page-header';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';

@Component({
  selector: 'app-employee-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeader, ErrorAlert, LoadingState],
  templateUrl: './employee-form-page.html',
  styleUrl: './employee-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormPage {
  readonly employeeId = input<string>(); // undefined si path: 'new', string si ':employeeId' o ':employeeId/edit'
  private readonly service = inject(EmployeesService);
  private readonly router = inject(Router);
  protected readonly loading = signal(!!this.employeeId());
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', Validators.required],
    category: [null as EmployeeCategory | null, Validators.required],
    client: ['', Validators.required],
    project: ['', Validators.required],
  });
  protected readonly categoryOptions = EMPLOYEE_CATEGORY_OPTIONS;

  constructor() {
    if (this.employeeId()) {
      this.loading.set(true);
      this.service.get(this.employeeId()!).subscribe({
        next: (employee) => {
          // Asumimos que get retorna el modelo Employee directo (no un estado ni un observable con LoadState)
          this.form.patchValue({
            name: employee.name,
            category: employee.category,
            client: employee.client,
            project: employee.project,
          });
          this.loading.set(false);
        },
        error: () => {
          this.error.set('No se pudo cargar los datos del colaborador.');
          this.loading.set(false);
        },
      });
    }
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set(null);
    const values = this.form.getRawValue();
    const request$ = this.employeeId()
      ? this.service.update(this.employeeId()!, values)
      : this.service.create(values);
    request$.subscribe({
      next: (employee) => {
        this.saving.set(false);
        void this.router.navigate(['/employees', employee.id]);
      },
      error: (err) => {
        this.error.set(typeof err === 'object' && err && 'message' in err ? (err as { message: string }).message : 'No se pudo guardar.');
        this.saving.set(false);
      },
    });
  }

  protected showError(field: 'name' | 'category' | 'client' | 'project'): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || control.dirty);
  }
}
