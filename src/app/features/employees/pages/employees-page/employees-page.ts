import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { EmployeeFiltersBar } from '../../components/employee-filters-bar';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_CATEGORY, EMPLOYEE_STATUS, Employee, EmployeeFilters } from '../../models/employees.models';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { toLoadState } from '../../../../shared/utils/to-load-state';

@Component({
  selector: 'app-employees-page',
  imports: [RouterLink, EmployeeFiltersBar, EmptyState, ErrorAlert, LoadingState, StatusBadge],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly service = inject(EmployeesService);
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly categoryInfo = EMPLOYEE_CATEGORY;
  protected readonly filters = signal<EmployeeFilters>({ search: '', category: null, client: '', project: '', status: null, page: 0, size: 10 });
  protected readonly allRecords = computed(() => {
    const { search, category, client, project, status } = this.filters();
    return !search && !category && !client && !project && !status;
  });
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ filters: this.filters(), reload: this.reloadCount() }));
  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(switchMap(({ filters }) => toLoadState(this.service.list(filters)))),
    { initialValue: { status: 'loading' } as LoadState<Page<Employee>> },
  );

  protected applyFilters(change: Pick<EmployeeFilters, 'search' | 'category' | 'client' | 'project' | 'status'>): void {
    this.filters.update(current => ({ ...current, ...change, page: 0 }));
  }

  protected goToPage(page: number): void {
    this.filters.update(current => ({ ...current, page }));
  }

  protected reload(): void {
    this.reloadCount.update(count => count + 1);
  }
}
