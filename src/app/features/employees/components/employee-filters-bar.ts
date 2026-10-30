import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EmployeeCategory, EmployeeFilters, EmployeeState, EMPLOYEE_CATEGORY_OPTIONS, EMPLOYEE_STATE_OPTIONS } from '../models/employees.models';

@Component({
  selector: 'app-employee-filters-bar',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="employee-filters card" [formGroup]="form" (ngSubmit)="apply()" role="search">
      <div class="form-field">
        <label for="employee-search">Buscar colaborador</label>
        <input id="employee-search" type="search" formControlName="search" placeholder="Nombre o legajo" />
      </div>
      <div class="form-field">
        <label for="employee-category">Categoría</label>
        <select id="employee-category" formControlName="category">
          <option value="">Todas</option>
          @for (option of categoryOptions; track option.value) {
            <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>
      <div class="form-field">
        <label for="employee-state">Estado</label>
        <select id="employee-state" formControlName="state">
          <option value="">Todos</option>
          @for (option of stateOptions; track option.value) {
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
    .employee-filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); align-items: end; gap: var(--space-md); margin-bottom: var(--space-lg); }
    .employee-filters__actions { display: flex; gap: var(--space-sm); }
    @media (max-width: 700px) { .employee-filters { grid-template-columns: 1fr; } }
  `,
})
export class EmployeeFiltersBar implements OnInit {
  readonly value = input.required<EmployeeFilters>();
  readonly applied = output<Pick<EmployeeFilters, 'search' | 'category' | 'state'>>();

  protected readonly categoryOptions = EMPLOYEE_CATEGORY_OPTIONS;
  protected readonly stateOptions = EMPLOYEE_STATE_OPTIONS;

  protected readonly form = inject(NonNullableFormBuilder).group({
    search: [''],
    category: ['' as EmployeeCategory | ''],
    state: ['' as EmployeeState | '']
  });

  ngOnInit(): void {
    const { search, category, state } = this.value();
    this.form.setValue({ search, category: category ?? '', state: state ?? '' });
  }

  protected apply(): void {
    const { search, category, state } = this.form.getRawValue();
    this.applied.emit({ search: search.trim(), category: category || null, state: state || null });
  }

  protected clear(): void {
    this.form.setValue({ search: '', category: '', state: '' });
    this.apply();
  }
}
