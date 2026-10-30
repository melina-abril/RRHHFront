import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EMPLOYEE_CATEGORY_OPTIONS, EMPLOYEE_STATUS_OPTIONS, EmployeeFilters } from '../models/employees.models';

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
        <label for="employee-category">Categoría</label>
        <select id="employee-category" formControlName="category">
          <option value="">Todas las categorías</option>
          @for (option of categoryOptions; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>
      <div class="form-field">
        <label for="employee-status">Estado</label>
        <select id="employee-status" formControlName="status">
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
    .employee-filters { display: grid; grid-template-columns: minmax(14rem, 2fr) minmax(11rem, 1fr) minmax(10rem, 1fr) auto; align-items: end; gap: var(--space-md); margin-bottom: var(--space-lg); }
    .employee-filters__actions { display: flex; gap: var(--space-sm); }
    @media (max-width: 800px) { .employee-filters { grid-template-columns: 1fr; } }
  `,
})
export class EmployeeFiltersBar implements OnInit {
  readonly value = input.required<EmployeeFilters>();
  readonly applied = output<Pick<EmployeeFilters, 'search' | 'category' | 'status'>>();

  protected readonly categoryOptions = EMPLOYEE_CATEGORY_OPTIONS;
  protected readonly statusOptions = EMPLOYEE_STATUS_OPTIONS;

  protected readonly form = inject(NonNullableFormBuilder).group({
    search: [''],
    category: ['' as string],
    status: ['' as string],
  });

  ngOnInit(): void {
    const { search, category, status } = this.value();
    this.form.setValue({ search, category: category ?? '', status: status ?? '' });
  }

  protected apply(): void {
    const { search, category, status } = this.form.getRawValue();
    this.applied.emit({
      search: search.trim(),
      category: category || null,
      status: status || null,
    });
  }

  protected clear(): void {
    this.form.setValue({ search: '', category: '', status: '' });
    this.apply();
  }
}
