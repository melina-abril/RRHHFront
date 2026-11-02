import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EMPLOYEE_STATUS_OPTIONS, EmployeeStatus, EmployeesFilters } from '../models/employees.models';

@Component({
  selector: 'app-employee-filters-bar',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="filters card" [formGroup]="form" (ngSubmit)="apply()" role="search">
      <div class="filters__top">
        <div class="form-field filters__search">
          <label for="employee-search">Buscar colaborador</label>
          <input id="employee-search" type="search" formControlName="search" placeholder="Nombre, apellido o legajo" />
        </div>
        <button class="button button--secondary" type="button" (click)="clear()">Limpiar filtros</button>
      </div>
      <div class="filters__selects">
        <div class="form-field">
          <label for="employee-department">Área o equipo</label>
          <input id="employee-department" formControlName="departmentId" placeholder="Todas las áreas" />
        </div>
        <div class="form-field">
          <label for="employee-position">Posición</label>
          <input id="employee-position" formControlName="positionId" placeholder="Todas las posiciones" />
        </div>
        <div class="form-field">
          <label for="employee-status">Estado</label>
          <select id="employee-status" formControlName="status">
            <option value="">Todos los estados</option>
            @for (option of statuses; track option.value) {
              <option [value]="option.value">{{ option.label }}</option>
            }
          </select>
        </div>
        <button class="button" type="submit">Filtrar</button>
      </div>
    </form>
  `,
  styles: `
    .filters { display: grid; gap: var(--space-md); margin-bottom: var(--space-lg); }
    .filters__top { display: flex; align-items: end; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap; }
    .filters__search { flex: 1 1 16rem; }
    .filters__selects { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)) auto; align-items: end; gap: var(--space-md); }
    @media (max-width: 800px) { .filters__selects { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 480px) { .filters__selects { grid-template-columns: 1fr; } }
  `,
})
export class EmployeeFiltersBar implements OnInit {
  readonly value = input.required<EmployeesFilters>();
  readonly applied = output<EmployeesFilters>();
  protected readonly statuses = EMPLOYEE_STATUS_OPTIONS;
  protected readonly form = inject(NonNullableFormBuilder).group({
    search: [''],
    status: ['' as EmployeeStatus | ''],
    departmentId: [''],
    positionId: [''],
  });

  ngOnInit(): void {
    const value = this.value();
    this.form.setValue({ search: value.search ?? '', status: value.status ?? '', departmentId: value.departmentId ?? '', positionId: value.positionId ?? '' });
  }

  protected apply(): void {
    const value = this.form.getRawValue();
    this.applied.emit({ search: value.search.trim() || null, status: value.status || null, departmentId: value.departmentId.trim() || null, positionId: value.positionId.trim() || null });
  }

  protected clear(): void {
    this.form.reset({ search: '', status: '', departmentId: '', positionId: '' });
    this.apply();
  }
}
