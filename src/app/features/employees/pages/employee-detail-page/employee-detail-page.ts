import { ChangeDetectionStrategy, Component, inject, input, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { DecimalPipe, DatePipe, AsyncPipe } from '@angular/common';
import { EmployeesService } from '../../data-access/employees.service';
import { Employee, EmployeeCategory, EMPLOYEE_CATEGORY_OPTIONS, EmployeeState, EMPLOYEE_STATE_OPTIONS } from '../../models/employees.models';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadingState } from '../../../../shared/components/loading-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { EmptyState } from '../../../../shared/components/empty-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { toLoadState } from '../../../../shared/utils/to-load-state';

@Component({
  selector: 'app-employee-detail-page',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe, AsyncPipe, PageHeader, LoadingState, ErrorAlert, EmptyState, StatusBadge],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  readonly employeeId = input.required<string>();
  private readonly service = inject(EmployeesService);
  protected readonly reloadCount = signal(0);

  protected readonly employeeState = computed(() => {
    return toLoadState(this.service.get(this.employeeId()));
  });
}
