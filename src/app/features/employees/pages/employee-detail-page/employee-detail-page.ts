import { ChangeDetectionStrategy, Component, inject, input, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_STATUS, Employee } from '../../models/employees.models';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { EmptyState } from '../../../../shared/components/empty-state';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';

@Component({
  selector: 'app-employee-detail-page',
  standalone: true,
  imports: [CommonModule, PageHeader, LoadingState, EmptyState, ErrorAlert, RouterLink, StatusBadge, DatePipe, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-page-header [title]="headerTitle" description="Ficha individual del colaborador"
      ><a routerLink="../" class="button button--secondary">Volver al listado</a></app-page-header
    >
    @let state = employeeState();
    @switch (state.status) {
      @case ('loading') {
        <app-loading-state message="Cargando ficha del colaborador…" />
      }
      @case ('error') {
        <app-error-alert [message]="state.message" retryLabel="Reintentar" (retry)="retry()" />
      }
      @case ('empty') {
        <app-empty-state message="No se encontró el colaborador." />
      }
      @case ('ready') {
        <div class="card employee-detail">
          <h2>{{ state.data.lastName }}, {{ state.data.firstName }}</h2>
          <div class="employee-detail__main-data">
            <dl>
              <dt>Legajo</dt>
              <dd>{{ state.data.legajo }}</dd>
              <dt>Categoría</dt>
              <dd>{{ state.data.category }}</dd>
              <dt>Correo</dt>
              <dd>{{ state.data.email }}</dd>
              <dt>Estado</dt>
              <dd>
                <app-status-badge [label]="EMPLOYEE_STATUS[state.data.status].label" [tone]="EMPLOYEE_STATUS[state.data.status].tone" />
              </dd>
            </dl>
            <div class="employee-detail__actions">
              <a class="button" [routerLink]="['../', state.data.id, 'edit']">Editar</a>
            </div>
          </div>

          <section class="employee-detail__section">
            <h3>Asignaciones</h3>
            @if (state.data.assignments?.length) {
              <ul>
                @for (assignment of state.data.assignments; track assignment.project) {
                  <li>
                    <strong>{{ assignment.project }}</strong>
                    <span>({{ assignment.client }})</span>
                    <span>Desde: {{ assignment.startDate | date: 'dd/MM/yyyy' }}</span>
                    @if (assignment.endDate) {
                      <span>Hasta: {{ assignment.endDate | date: 'dd/MM/yyyy' }}</span>
                    }
                  </li>
                }
              </ul>
            } @else {
              <div>No hay asignaciones registradas.</div>
            }
          </section>
          <!-- Otras secciones (beneficios, documentos, evaluaciones, remuneraciones, bitácora) -->
        </div>
      }
    }
  `,
  styleUrl: './employee-detail-page.scss',
})
export class EmployeeDetailPage {
  protected readonly EMPLOYEE_STATUS = EMPLOYEE_STATUS;
  // id de la ruta → employee
  readonly id = input.required<string>();
  private readonly employeesService = inject(EmployeesService);
  private readonly reloadCount = signal(0);
  protected readonly headerTitle = 'Ficha de colaborador';

  protected readonly employeeState = computed<() => LoadState<Employee>>(() => {
    const id = this.id();
    const reload = this.reloadCount();
    return toLoadState(this.employeesService.get(id));
  });

  protected retry(): void {
    this.reloadCount.set(this.reloadCount() + 1);
  }
}
