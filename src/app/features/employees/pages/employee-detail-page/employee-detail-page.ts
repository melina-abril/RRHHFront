import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeesService } from '../../data-access/employees.service';
import { Employee, EMPLOYEE_CATEGORIES, EMPLOYEE_STATUSES } from '../../models/employees.models';

@Component({
  selector: 'app-employee-detail-page',
  imports: [RouterLink, DatePipe, ErrorAlert, LoadingState, StatusBadge],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  readonly id = input.required<string>();
  private readonly service = inject(EmployeesService);
  protected readonly categories = EMPLOYEE_CATEGORIES;
  protected readonly statuses = EMPLOYEE_STATUSES;
  protected readonly activeSection = signal('personal');
  protected readonly employeeState = toSignal(
    toObservable(this.id).pipe(switchMap(id => toLoadState(this.service.getEmployee(id)))),
    { initialValue: { status: 'loading' } as LoadState<Employee> },
  );

  protected selectSection(section: string): void {
    this.activeSection.set(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
