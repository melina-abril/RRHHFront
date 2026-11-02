import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeeFiltersBar } from '../../components/employee-filters-bar';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_STATUS, EmployeeDto, EmployeesFilters, EmployeesPageQuery } from '../../models/employees.models';

@Component({
  selector: 'app-employees-page',
  imports: [RouterLink, DatePipe, EmployeeFiltersBar, EmptyState, ErrorAlert, LoadingState, StatusBadge],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly service = inject(EmployeesService);
  private readonly currentUser = inject(CurrentUser);
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly canEdit = computed(() => this.currentUser.hasRole(['ADMIN']));
  protected readonly filters = signal<EmployeesPageQuery>({ search: null, status: null, departmentId: null, positionId: null, page: 0, size: 20 });
  protected readonly allRecords = computed(() => {
    const f = this.filters();
    return !f.search && !f.status && !f.departmentId && !f.positionId;
  });
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ filters: this.filters(), reload: this.reloadCount() }));
  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(switchMap(({ filters }) => toLoadState(this.service.listEmployees(filters)))),
    { initialValue: { status: 'loading' } as LoadState<Page<EmployeeDto>> },
  );

  protected applyFilters(value: EmployeesFilters): void {
    this.filters.update((current) => ({ ...current, ...value, page: 0 }));
  }

  protected goToPage(page: number): void {
    this.filters.update((current) => ({ ...current, page }));
  }

  protected changeSize(value: string): void {
    const size = Number(value);
    if ([10, 20, 50].includes(size)) this.filters.update((current) => ({ ...current, size, page: 0 }));
  }

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
