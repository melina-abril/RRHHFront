import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EMPLOYEE_STATUS_OPTIONS, EmployeeFilters, EmployeeStatus } from '../models/employees.models';

/**
 * Componente de filtros de empleados: búsqueda y opciones (categoría, cliente, proyecto, estado),
 * siguiendo la maqueta y contractFiles, no llama al servicio directamente.
 */
@Component({
  selector: 'app-employee-filters-bar',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="card employee-filters" [formGroup]="form" (ngSubmit)="apply()" role="search">
      <div class="form-field">
        <label for="employee-search">Buscar colaborador</label>
        <input id="employee-search" type="search" formControlName="search" placeholder="Nombre, apellido o legajo" />
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
      <!--
        Filtros por departamento y posición: placeholders para futuros combos/catálogo; por ahora solo el estado viaja al backend.
      -->
      <div class="form-field">
        <label for="employee-department">Categoría</label>
        <select id="employee-department" formControlName="departmentId">
          <option value="">Todas las categorías</option>
          <!-- MOCK: No hay departamentos predefinidos aún -->
        </select>
      </div>
      <div class="form-field">
        <label for="employee-position">Puesto</label>
        <select id="employee-position" formControlName="positionId">
          <option value="">Todos los puestos</option>
          <!-- MOCK: No hay puestos predefinidos aún -->
        </select>
      </div>
      <div class="employee-filters__actions">
        <button type="submit" class="button">Filtrar</button>
        <button type="button" class="button button--secondary" (click)="clear()">Limpiar filtros</button>
      </div>
    </form>
  `,
  styles: `
    .employee-filters { display: grid; grid-template-columns: minmax(15rem, 2.5fr) repeat(3, minmax(8rem, 1fr)) auto; align-items: end; gap: var(--space-md); margin-bottom: var(--space-lg); }
    .employee-filters__actions { display: flex; gap: var(--space-sm); }
    @media (max-width: 900px) { .employee-filters { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 600px) { .employee-filters { grid-template-columns: 1fr; } }
  `,
})
export class EmployeeFiltersBar implements OnInit {
  readonly value = input.required<EmployeeFilters>();
  readonly applied = output<Partial<EmployeeFilters>>();

  protected readonly statusOptions = EMPLOYEE_STATUS_OPTIONS;

  protected readonly form = inject(NonNullableFormBuilder).group({
    search: [''],
    status: ['' as EmployeeStatus | ''],
    departmentId: [''],
    positionId: [''],
  });

  ngOnInit(): void {
    const { search, status, departmentId, positionId } = this.value();
    this.form.setValue({ search, status: status ?? '', departmentId: departmentId ?? '', positionId: positionId ?? '' });
  }

  protected apply(): void {
    const { search, status, departmentId, positionId } = this.form.getRawValue();
    this.applied.emit({
      search: search.trim(),
      status: status || null,
      departmentId: departmentId || null,
      positionId: positionId || null
    });
  }

  protected clear(): void {
    this.form.setValue({ search: '', status: '', departmentId: '', positionId: '' });
    this.apply();
  }
}
