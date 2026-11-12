import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeeManagementService } from '../../data-access/employee-management.service';
import { EMPLOYEE_CATEGORY, EMPLOYEE_STATUS, Employee, EmployeeFilters } from '../../models/employee-management.models';

@Component({
  selector: 'app-employees-page',
  imports: [RouterLink, PageHeader, LoadingState, EmptyState, ErrorAlert, StatusBadge],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly service = inject(EmployeeManagementService);
  private readonly currentUser = inject(CurrentUser);
  protected readonly canCreate = computed(() => this.currentUser.hasRole(['ADMIN']));
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly categories = EMPLOYEE_CATEGORY;
  protected readonly filters = signal<EmployeeFilters>({ search: '', page: 0, size: 10 });
  protected readonly searchText = signal('');
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ filters: this.filters(), reload: this.reloadCount() }));
  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(
      switchMap(({ filters }) => toLoadState(this.service.list(filters)).pipe(
        map((state): LoadState<Page<Employee>> => state.status === 'ready' && state.data.items.length === 0 ? { status: 'empty' } : state),
      )),
    ),
    { initialValue: { status: 'loading' } as LoadState<Page<Employee>> },
  );

  protected search(value: string): void {
    this.searchText.set(value);
    this.filters.update((current) => ({ ...current, search: value.trim(), page: 0 }));
  }

  protected clearSearch(): void {
    this.search('');
  }

  protected goToPage(page: number): void {
    this.filters.update((current) => ({ ...current, page }));
  }

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
