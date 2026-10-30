import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CurrentUser } from '../../../../core/session/current-user';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_CATEGORY, EMPLOYEE_STATUS, EmployeeDetails } from '../../models/employees.models';
import { toSignal } from '@angular/core/rxjs-interop';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { toLoadState } from '../../../../shared/utils/to-load-state';

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
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  protected readonly categoryInfo = EMPLOYEE_CATEGORY;
  protected readonly statusInfo = EMPLOYEE_STATUS;

  protected readonly detailState = toSignal(
    toObservable(this.id).pipe(switchMap((id) => toLoadState(this.employeesService.get(id)))),
    { initialValue: { status: 'loading' } as LoadState<EmployeeDetails> },
  );

  protected readonly showLocation = true;
}
