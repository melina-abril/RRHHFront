import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EmployeesService } from '../../data-access/employees.service';
import { EmployeeRequest, EMPLOYEE_STATUS } from '../../models/employees.models';
import { PageHeader } from '../../../../shared/components/page-header';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadState } from '../../../../shared/models/load-state';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';

@Component({
  selector: 'app-employee-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PageHeader, ErrorAlert],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="formTitle" description="Carga o edición de datos personales y laborales"
      ><a routerLink="../" class="button button--secondary">Volver al listado</a></app-page-header
    >
    <form [formGroup]="form" (ngSubmit)="submit()" autocomplete="off" class="card employee-form">
      <div class="form-grid">
        <div class="form-field">
          <label for="firstName">Nombre</label>
          <input
            id="firstName"
            type="text"
            formControlName="firstName"
            [attr.aria-invalid]="showError('firstName')"
          />
          @if (showError('firstName')) {
            <span class="form-field__error">Nombre requerido.</span>
          }
        </div>

        <div class="form-field">
          <label for="lastName">Apellido</label>
          <input
            id="lastName"
            type="text"
            formControlName="lastName"
            [attr.aria-invalid]="showError('lastName')"
          />
          @if (showError('lastName')) {
            <span class="form-field__error">Apellido requerido.</span>
          }
        </div>

        <div class="form-field">
          <label for="email">Correo</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            [attr.aria-invalid]="showError('email')"
          />
          @if (showError('email')) {
            <span class="form-field__error">Correo válido requerido.</span>
          }
        </div>

        <div class="form-field">
          <label for="category">Categoría</label>
          <select id="category" formControlName="category" [attr.aria-invalid]="showError('category')">
            <option value="">Selecciona una categoría</option>
            <option value="Permanente">Permanente</option>
            <option value="Pasante">Pasante</option>
          </select>
          @if (showError('category')) {
            <span class="form-field__error">Categoría requerida.</span>
          }
        </div>
      </div>

      @if (error(); as message) {
        <app-error-alert [message]="message" />
      }

      <div class="form-actions">
        <button type="submit" class="button" [disabled]="saving()">{{ formTitle }}</button>
        <a routerLink="../" class="button button--secondary">Cancelar</a>
      </div>
    </form>
  `,
  styleUrl: './employee-form-page.scss',
})
export class EmployeeFormPage {
  readonly id = input<string>();
  protected readonly EMPLOYEE_STATUS = EMPLOYEE_STATUS;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly employeesService = inject(EmployeesService);
  private readonly router = inject(Router);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);

  protected get formTitle(): string {
    return this.id() ? 'Editar colaborador' : 'Alta de colaborador';
  }

  protected readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    category: ['', Validators.required],
  });

  protected showError(field: keyof EmployeeRequest): boolean {
    const control = this.form.controls[field];
    return control.invalid && (control.touched || this.form.dirty);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    const data = this.form.getRawValue();

    if (this.id()) {
      // Edición
      this.employeesService.update(this.id()!, data).subscribe({
        next: () => this.router.navigate([ '../', this.id() ]),
        error: (err) => {
          this.error.set(errorMessage(err));
          this.saving.set(false);
        },
      });
    } else {
      // Alta
      this.employeesService.create(data).subscribe({
        next: (res) => this.router.navigate([ '../', res.id ]),
        error: (err) => {
          this.error.set(errorMessage(err));
          this.saving.set(false);
        },
      });
    }
  }
}
