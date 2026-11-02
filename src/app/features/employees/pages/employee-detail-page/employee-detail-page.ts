import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { EMPLOYEE_STATUS, Employee } from '../../models/employees.models';
import { EmployeesService } from '../../data-access/employees.service';

@Component({
  selector: 'app-employee-detail-page',
  imports: [RouterLink, DatePipe, PageHeader, LoadingState, ErrorAlert, StatusBadge],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  readonly id = input.required<string>();
  private readonly employeesService = inject(EmployeesService);
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly employeeState = toSignal(
    toObservable(this.id).pipe(sid => sid.pipe(switchMap(id => this.employeesService.get(id)))),
    { initialValue: { status: 'loading' } as LoadingState<Employee> },
  );
  protected readonly section = signal<'personal' | 'work'>('personal');
  protected readonly locationBar = computed(() => 'Gestión de Empleados / Ficha individual');

  protected readonly identificationGroup = computed(() => ['employeeNumber', 'documentType', 'documentNumber', 'birthDate']);
  protected readonly contactGroup = computed(() => ['email', 'phone']);
}
