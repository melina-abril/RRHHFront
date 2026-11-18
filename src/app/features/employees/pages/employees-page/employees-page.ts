import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
import { Employee, EmployeeFilters, EMPLOYEE_CATEGORIES, EMPLOYEE_STATUSES } from '../../models/employees.models';

@Component({
  selector: 'app-employees-page',
  imports: [RouterLink, EmployeeFiltersBar, LoadingState, ErrorAlert, EmptyState, StatusBadge],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly service = inject(EmployeesService);
  private readonly currentUser = inject(CurrentUser);
  private readonly reloadCount = signal(0);
  protected readonly categories = EMPLOYEE_CATEGORIES;
  protected readonly statuses = EMPLOYEE_STATUSES;
  protected readonly canCreate = computed(() => this.currentUser.hasRole(['ADMIN']));
  protected readonly filters = signal<EmployeeFilters>({ search: '', category: null, status: null, country: '', client: '', project: '', page: 0, size: 10 });
  protected readonly isUnfiltered = computed(() => {
    const f = this.filters();
    return !f.search && !f.category && !f.status && !f.country && !f.client && !f.project;
  });
  private readonly request = computed(() => ({ filters: this.filters(), reload: this.reloadCount() }));
  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(switchMap(({ filters }) => toLoadState(this.service.listEmployees(filters)))),
    { initialValue: { status: 'loading' } as LoadState<Page<Employee>> },
  );

  protected applyFilters(change: Pick<EmployeeFilters, 'search' | 'category' | 'status' | 'country' | 'client' | 'project'>): void {
    this.filters.update(current => ({ ...current, ...change, page: 0 }));
  }

  protected goToPage(page: number): void {
    this.filters.update(current => ({ ...current, page }));
  }

  protected reload(): void {
    this.reloadCount.update(count => count + 1);
  }
}
