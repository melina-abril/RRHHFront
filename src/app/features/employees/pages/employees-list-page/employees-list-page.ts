import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { EmployeeFiltersBar } from '../../components/employee-filters-bar';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_CATEGORY, EMPLOYEE_STATUS, EmployeeFilters, EmployeeList } from '../../models/employees.models';

@Component({
  selector: 'app-employees-list-page',
  imports: [RouterLink, DatePipe, PageHeader, LoadingState, EmptyState, ErrorAlert, StatusBadge, EmployeeFiltersBar],
  templateUrl: './employees-list-page.html',
  styleUrl: './employees-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesListPage {
  private readonly employeesService = inject(EmployeesService);
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  protected readonly categoryInfo = EMPLOYEE_CATEGORY;
  protected readonly statusInfo = EMPLOYEE_STATUS;

  protected readonly filters = signal<EmployeeFilters>({ search: '', legajo: '', category: null, client: '', project: '', status: null, page: 0, size: 20 });
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ filters: this.filters(), reload: this.reloadCount() }));

  protected readonly state = toSignal(
    toObservable(this.request).pipe(
      switchMap(({ filters }) => this.employeesService.list(filters))
        .pipe(switchMap(data => import('../../../../shared/utils/to-load-state').then(m => m.toLoadState(Promise.resolve(data))))),
    ),
    { initialValue: { status: 'loading' } as LoadState<Page<EmployeeList>> },
  );

  protected applyFilters(change: Pick<EmployeeFilters, 'search' | 'category' | 'status'>): void {
    this.filters.update(current => ({ ...current, ...change, page: 0 }));
  }

  protected goToPage(page: number): void {
    this.filters.update(current => ({ ...current, page }));
  }

  protected reload(): void {
    this.reloadCount.update(count => count + 1);
  }

  protected readonly showAllRecords = computed(() => {
    const f = this.filters();
    return !f.search && !f.legajo && !f.category && !f.status && !f.client && !f.project;
  });
}
