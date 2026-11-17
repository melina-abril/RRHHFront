import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeeFiltersBar } from '../../components/employee-filters-bar';
import { Employees2Service } from '../../data-access/employees-2.service';
import { EMPLOYEE_CATEGORIES, EMPLOYEE_STATUSES, EmployeeFilters, EmployeeResponse } from '../../models/employees-2.models';

@Component({
  selector: 'app-employees-list-page',
  imports: [RouterLink, EmptyState, ErrorAlert, LoadingState, StatusBadge, EmployeeFiltersBar],
  templateUrl: './employees-list-page.html',
  styleUrl: './employees-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesListPage {
  private readonly service = inject(Employees2Service);
  protected readonly categories = EMPLOYEE_CATEGORIES;
  protected readonly statuses = EMPLOYEE_STATUSES;
  protected readonly filters = signal<EmployeeFilters>({ search: '', category: null, client: '', project: '', status: null, page: 0, size: 10 });
  protected readonly allRecords = computed(() => {
    const value = this.filters();
    return !value.search.trim() && !value.category && !value.client.trim() && !value.project.trim() && !value.status;
  });
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ filters: this.filters(), reload: this.reloadCount() }));
  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(switchMap(({ filters }) => toLoadState(this.service.listEmployees(filters)))),
    { initialValue: { status: 'loading' } as LoadState<Page<EmployeeResponse>> },
  );

  protected applyFilters(change: Pick<EmployeeFilters, 'search' | 'category' | 'client' | 'project' | 'status'>): void {
    this.filters.update((value) => ({ ...value, ...change, page: 0 }));
  }

  protected goToPage(page: number): void {
    this.filters.update((value) => ({ ...value, page }));
  }

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
