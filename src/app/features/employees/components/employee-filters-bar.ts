import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EmployeeCategory, EmployeeFilters, EmployeeStatus } from '../models/employees.models';

type FilterValues = Pick<EmployeeFilters, 'search' | 'category' | 'status' | 'country' | 'client' | 'project'>;

@Component({
  selector: 'app-employee-filters-bar',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="filters card" [formGroup]="form" (ngSubmit)="apply()" role="search">
      <div class="filters__heading"><h2>Buscar y filtrar</h2><button class="filters__clear" type="button" (click)="clear()">Limpiar filtros</button></div>
      <div class="filters__fields">
        <div class="form-field filters__search"><label for="employee-search">Nombre o legajo</label><input id="employee-search" type="search" formControlName="search" placeholder="Buscar colaborador o legajo" /></div>
        <div class="form-field"><label for="employee-category">Categoría</label><select id="employee-category" formControlName="category"><option value="">Todas</option><option value="PERMANENT">Permanente</option><option value="INTERN">Pasante</option></select></div>
        <div class="form-field"><label for="employee-client">Cliente</label><input id="employee-client" formControlName="client" placeholder="Todos" /></div>
        <div class="form-field"><label for="employee-project">Proyecto</label><input id="employee-project" formControlName="project" placeholder="Todos" /></div>
        <div class="form-field"><label for="employee-status">Estado</label><select id="employee-status" formControlName="status"><option value="">Todos</option><option value="ACTIVE">Activo</option><option value="INACTIVE">Inactivo</option></select></div>
        <div class="form-field"><label for="employee-country">País</label><input id="employee-country" formControlName="country" placeholder="Todos" /></div>
        <button class="button" type="submit">Filtrar</button>
      </div>
    </form>
  `,
  styles: `
    .filters { display: grid; gap: var(--space-lg); margin-bottom: var(--space-lg); }
    .filters__heading { display: flex; justify-content: space-between; align-items: center; gap: var(--space-md); }
    .filters__heading h2 { margin: 0; font-size: 1.125rem; }
    .filters__clear { border: 0; background: transparent; color: var(--primary); font-weight: 600; cursor: pointer; }
    .filters__fields { display: flex; flex-wrap: wrap; gap: var(--space-md); align-items: end; }
    .filters__fields .form-field { flex: 1 1 9rem; }
    .filters__fields .filters__search { flex: 2 1 14rem; }
  `,
})
export class EmployeeFiltersBar implements OnInit {
  readonly value = input.required<EmployeeFilters>();
  readonly applied = output<FilterValues>();

  protected readonly form = inject(NonNullableFormBuilder).group({
    search: [''],
    category: ['' as EmployeeCategory | ''],
    status: ['' as EmployeeStatus | ''],
    country: [''],
    client: [''],
    project: [''],
  });

  ngOnInit(): void {
    const value = this.value();
    this.form.setValue({ search: value.search, category: value.category ?? '', status: value.status ?? '', country: value.country, client: value.client, project: value.project });
  }

  protected apply(): void {
    const value = this.form.getRawValue();
    this.applied.emit({ search: value.search.trim(), category: value.category || null, status: value.status || null, country: value.country.trim(), client: value.client.trim(), project: value.project.trim() });
  }

  protected clear(): void {
    this.form.reset({ search: '', category: '', status: '', country: '', client: '', project: '' });
    this.apply();
  }
}
