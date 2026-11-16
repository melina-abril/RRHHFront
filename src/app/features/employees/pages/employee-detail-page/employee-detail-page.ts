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
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_CATEGORY, EMPLOYEE_DEDICATION, EMPLOYEE_STATUS, EMPLOYEE_WORK_MODE, EmployeeResponse } from '../../models/employees.models';

@Component({
  selector: 'app-employee-detail-page',
  imports: [RouterLink, DatePipe, ErrorAlert, LoadingState, PageHeader, StatusBadge],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  readonly id = input.required<string>();
  private readonly employeesService = inject(EmployeesService);
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly categories = EMPLOYEE_CATEGORY;
  protected readonly dedications = EMPLOYEE_DEDICATION;
  protected readonly workModes = EMPLOYEE_WORK_MODE;
  protected readonly employeeState = toSignal(
    toObservable(this.id).pipe(switchMap((id) => toLoadState(this.employeesService.get(id)))),
    { initialValue: { status: 'loading' } as LoadState<EmployeeResponse> },
  );
}
