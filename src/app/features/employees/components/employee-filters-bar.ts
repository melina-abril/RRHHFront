import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  EmployeeCategory,
  EmployeeFilters,
  EMPLOYEE_CATEGORIES,
  EMPLOYEE_STATUS_OPTIONS,
  EmployeeStatus
} from '../models/employees.models';

/** Filtros del listado de colaboradores: búsqueda y selects; la página nunca arranca desde acá. */
@Component({
  selector: 'app-employee-filters-bar',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="employee-filters card" [formGroup]="form" (ngSubmit)="apply()" role="search">
      <div class="form-field">
        <label for="employee-search">Buscar colaborador</label>
        <input id="employee-search" type="search" formControlName="search" placeholder="Nombre, apellido o legajo" />
      </div>
      <div class="form-field">
        <label for="filter-category">Categoría</label>
        <select id="filter-category" formControlName="category">
          <option value="">Todas las categorías</option>
          @for (option of categoryOptions; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>
      <div class="form-field">
        <label for="filter-status">Estado</label>
        <select id="filter-status" formControlName="status">
          <option value="">Todos los estados</option>
          @for (option of statusOptions; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>
      <div class="employee-filters__actions">
        <button type="submit" class="button">Filtrar</button>
        <button type="button" class="button button--secondary" (click)="clear()">Limpiar filtros</button>
      </div>
    </form>
  `,
  styles: `
    .employee-filters { display: grid; grid-template-columns: minmax(12rem,2fr) minmax(10rem,1fr) minmax(10rem,1fr) auto; align-items: end; gap: var(--space-md); margin-bottom: var(--space-lg); }
    .employee-filters__actions { display: flex; gap: var(--space-sm); }
    @media (max-width: 850px) { .employee-filters { grid-template-columns: 1fr; } }
  `,
})
export class EmployeeFiltersBar implements OnInit {
  readonly value = input.required<EmployeeFilters>();
  readonly applied = output<Pick<EmployeeFilters, 'search' | 'status' | 'category'>>();

  protected readonly statusOptions = EMPLOYEE_STATUS_OPTIONS;
  protected readonly categoryOptions = EMPLOYEE_CATEGORIES;

  protected readonly form = inject(NonNullableFormBuilder).group({
    search: [''],
    status: ['' as EmployeeStatus | ''],
    category: ['' as EmployeeCategory | ''],
  });

  ngOnInit(): void {
    const { search, status, category } = this.value();
    this.form.setValue({ search, status: status ?? '', category: category ?? '' });
  }

  protected apply(): void {
    const { search, status, category } = this.form.getRawValue();
    this.applied.emit({ search: search.trim(), status: status || null, category: category || null });
  }

  protected clear(): void {
    this.form.setValue({ search: '', status: '', category: '' });
    this.apply();
  }
}
