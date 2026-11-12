import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeeManagementService } from '../../data-access/employee-management.service';
import { EMPLOYEE_CATEGORY, EMPLOYEE_COMMITMENT, EMPLOYEE_STATUS, EMPLOYEE_WORK_MODE, Employee } from '../../models/employee-management.models';

@Component({
  selector: 'app-employee-detail-page',
  imports: [RouterLink, DatePipe, PageHeader, LoadingState, ErrorAlert, StatusBadge],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  readonly id = input.required<string>();
  private readonly service = inject(EmployeeManagementService);
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ id: this.id(), reload: this.reloadCount() }));
  protected readonly categories = EMPLOYEE_CATEGORY;
  protected readonly commitments = EMPLOYEE_COMMITMENT;
  protected readonly workModes = EMPLOYEE_WORK_MODE;
  protected readonly statuses = EMPLOYEE_STATUS;
  protected readonly employeeState = toSignal(
    toObservable(this.request).pipe(switchMap(({ id }) => toLoadState(this.service.getEmployee(id)))),
    { initialValue: { status: 'loading' } as LoadState<Employee> },
  );

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
