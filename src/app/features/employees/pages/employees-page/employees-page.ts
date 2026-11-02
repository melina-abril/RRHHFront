import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { EmployeesService } from '../../data-access/employees.service';
import { Employee, EmployeeFilters, EMPLOYEE_STATUS } from '../../models/employees.models';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadingState } from '../../../../shared/components/loading-state';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { StatusBadge } from '../../../../shared/components/status-badge';

@Component({
  selector: 'app-employees-page',
  standalone: true,
  imports: [FormsModule, PageHeader, LoadingState, EmptyState, ErrorAlert, StatusBadge, RouterLink, DecimalPipe, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header title="Colaboradores" description="Lista de todos los colaboradores, activos e inactivos.">
      <button class="button" type="button" routerLink="new">Alta de colaborador</button>
    </app-page-header>

    <div class="table-wrapper">
      <!-- Filtros principales (búsqueda/filtros rápidos) -->
      <div class="employees-filters">
        <input
          type="search"
          placeholder="Buscar por nombre, apellido o legajo"
          [(ngModel)]="filters.name"
          (ngModelChange)="refresh()"
          aria-label="Buscar colaborador" />
        <select [(ngModel)]="filters.status" (ngModelChange)="refresh()" aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          @for (key of statusOptions; track key) {
            <option [value]="key">{{ EMPLOYEE_STATUS[key].label }}</option>
          }
        </select>
      </div>

      @let state = employeesState();
      @switch (state.status) {
        @case ('loading') {
          <app-loading-state message="Cargando colaboradores…" />
        }
        @case ('error') {
          <app-error-alert [message]="state.message" retryLabel="Reintentar" (retry)="retry()" />
        }
        @case ('empty') {
          <app-empty-state message="No se encontraron colaboradores. Puedes dar de alta uno nuevo." />
        }
        @case ('ready') {
          <table class="data-table" aria-describedby="employees-table-caption">
            <caption id="employees-table-caption" class="visually-hidden">Listado de colaboradores</caption>
            <thead>
              <tr>
                <th>Legajo</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Cliente/Proyecto</th>
                <th>Estado</th>
                <th>Ver</th>
              </tr>
            </thead>
            <tbody>
              @for (employee of state.data.items; track employee.id) {
                <tr>
                  <td>{{ employee.legajo }}</td>
                  <td>{{ employee.lastName }}, {{ employee.firstName }}</td>
                  <td>{{ employee.category }}</td>
                  <td>
                    @if (employee.assignments?.length) {
                      {{ employee.assignments[0].client }}<br />
                      <small>{{ employee.assignments[0].project }}</small>
                    } @else {—}
                  </td>
                  <td>
                    <app-status-badge [label]="EMPLOYEE_STATUS[employee.status].label" [tone]="EMPLOYEE_STATUS[employee.status].tone" />
                  </td>
                  <td>
                    <a class="button button--secondary" [routerLink]="employee.id">Ficha</a>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      }
    </div>
  `,
  styleUrl: './employees-page.scss',
})
export class EmployeesPage {
  protected readonly EMPLOYEE_STATUS = EMPLOYEE_STATUS;
  protected readonly statusOptions = Object.keys(EMPLOYEE_STATUS);

  private readonly employeesService = inject(EmployeesService);
  private readonly router = inject(Router);

  // Filtros y paginación simples: state en signals locales
  protected filters: EmployeeFilters = { name: '', status: '' };
  private readonly reloadCount = signal(0);
  private readonly filtersSignal = signal(this.filters);

  protected readonly employeesState = computed<() => LoadState<Page<Employee>>>(() => {
    // Simple reconstrucción del objeto para que al llamar refresh() (por ngModelChange) vuelvan a consultar
    const filtersCopy = { ...this.filters };
    const reload = this.reloadCount();
    return toLoadState(this.employeesService.list(filtersCopy));
  });

  protected retry(): void {
    this.reloadCount.set(this.reloadCount() + 1);
  }

  protected refresh(): void {
    this.retry();
  }
}
