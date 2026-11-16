import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EmployeeCategory, EmployeeFilters, EmployeeStatus } from '../models/employees.models';

@Component({
  selector: 'app-employee-filters-bar',
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form class="card filters" [formGroup]="form" (ngSubmit)="apply()" role="search">
      <div class="filters__heading"><h2>Buscar y filtrar</h2><button class="filters__clear" type="button" (click)="clear()">Limpiar filtros</button></div>
      <div class="filters__fields">
        <div class="form-field"><label for="employee-search">Nombre o legajo</label><input id="employee-search" type="search" formControlName="search" placeholder="Buscar colaborador o legajo" /></div>
        <div class="form-field"><label for="employee-category">Categoría</label><select id="employee-category" formControlName="category"><option value="">Todas</option><option value="PERMANENT">Permanente</option><option value="INTERN">Pasante</option></select></div>
        <div class="form-field"><label for="employee-client">Cliente</label><input id="employee-client" formControlName="client" placeholder="Todos" /></div>
        <div class="form-field"><label for="employee-project">Proyecto</label><input id="employee-project" formControlName="project" placeholder="Todos" /></div>
        <div class="form-field"><label for="employee-status">Estado</label><select id="employee-status" formControlName="status"><option value="">Todos</option><option value="ACTIVE">Activo</option><option value="INACTIVE">Inactivo</option></select></div>
      </div>
      <button class="button filters__submit" type="submit">Aplicar filtros</button>
    </form>
  `,
  styles: `
    .filters { display: grid; gap: var(--space-md); }
    .filters__heading { display: flex; align-items: center; justify-content: space-between; gap: var(--space-sm); }
    .filters__heading h2 { margin: 0; font-size: 1.125rem; }
    .filters__clear { border: 0; background: transparent; color: var(--primary); font: inherit; font-weight: 600; cursor: pointer; }
    .filters__fields { display: grid; grid-template-columns: minmax(12rem, 2fr) repeat(4, minmax(8rem, 1fr)); gap: var(--space-md); align-items: end; }
    .filters__submit { justify-self: end; }
    @media (max-width: 950px) { .filters__fields { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 520px) { .filters__fields { grid-template-columns: 1fr; } }
  `,
})
export class EmployeeFiltersBar implements OnInit {
  readonly value = input.required<EmployeeFilters>();
  readonly applied = output<Pick<EmployeeFilters, 'search' | 'category' | 'client' | 'project' | 'status'>>();
  protected readonly form = inject(NonNullableFormBuilder).group({
    search: [''], category: ['' as EmployeeCategory | ''], client: [''], project: [''], status: ['' as EmployeeStatus | ''],
  });

  ngOnInit(): void {
    const { search, category, client, project, status } = this.value();
    this.form.setValue({ search, category: category ?? '', client, project, status: status ?? '' });
  }

  protected apply(): void {
    const { search, category, client, project, status } = this.form.getRawValue();
    this.applied.emit({ search: search.trim(), category: category || null, client: client.trim(), project: project.trim(), status: status || null });
  }

  protected clear(): void {
    this.form.reset({ search: '', category: '', client: '', project: '', status: '' });
    this.apply();
  }
}
