import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
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
  imports: [RouterLink, DatePipe, LoadingState, ErrorAlert, PageHeader, StatusBadge],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  readonly id = input.required<string>();
  private readonly service = inject(EmployeeManagementService);
  protected readonly statuses = EMPLOYEE_STATUS;
  protected readonly categories = EMPLOYEE_CATEGORY;
  protected readonly commitments = EMPLOYEE_COMMITMENT;
  protected readonly workModes = EMPLOYEE_WORK_MODE;
  protected readonly employeeState = toSignal(
    toObservable(this.id).pipe(switchMap((id) => toLoadState(this.service.get(id)))),
    { initialValue: { status: 'loading' } as LoadState<Employee> },
  );
}
