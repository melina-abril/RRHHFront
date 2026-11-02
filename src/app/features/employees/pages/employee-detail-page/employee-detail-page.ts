import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { errorMessage } from '../../../../core/http/api-error';
import { LoadingState } from '../../../../shared/components/loading-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadState } from '../../../../shared/models/load-state';
import { EmployeesService } from '../../data-access/employees.service';
import { EmployeeDetail, EMPLOYEE_STATUS } from '../../models/employees.models';

@Component({
  selector: 'app-employee-detail-page',
  imports: [RouterLink, DatePipe, LoadingState, ErrorAlert, StatusBadge, PageHeader],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  readonly id = input.required<string>();
  private readonly employeesService = inject(EmployeesService);
  private readonly router = inject(Router);

  protected readonly statusInfo = EMPLOYEE_STATUS;

  protected readonly employeeState = toSignal(
    toObservable(this.id).pipe(
      // toLoadState para manejar los estados de carga/error
      switchMap((id) => this.employeesService.get(id)),
    ),
    { initialValue: { status: 'loading' } as LoadState<EmployeeDetail> },
  );

  protected readonly showTab = signal<'personal' | 'laboral'>('personal');
  protected readonly error = signal<string | null>(null);

  protected readonly tabs = [
    { key: 'personal', label: 'Datos personales' },
    { key: 'laboral', label: 'Información laboral' },
    // secciones pendientes: asignaciones, perfil, etc
  ];

  protected show(tab: 'personal' | 'laboral') { this.showTab.set(tab); }
}
