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
import { Employee, EmployeeFilters, EMPLOYEE_STATUS, isShowingAllRecords } from '../../models/employees.models';
import { EmployeesService } from '../../data-access/employees.service';
import { EmployeeFiltersBar } from '../../components/employee-filters-bar';

@Component({
  selector: 'app-employees-page',
  imports: [RouterLink, DatePipe, PageHeader, LoadingState, EmptyState, ErrorAlert, StatusBadge, EmployeeFiltersBar],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly employeesService = inject(EmployeesService);
  private readonly currentUser = inject(CurrentUser);
  private readonly router = inject(Router);

  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly canEdit = computed(() => this.currentUser.hasRole(['ADMIN']));

  protected readonly filters = signal<EmployeeFilters>({
    search: '',
    status: null,
    category: null,
    client: null,
    project: null,
    page: 0,
    size: 20,
  });
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ filters: this.filters(), reload: this.reloadCount() }));

  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(
      switchMap(({ filters }) => this.employeesService.list(filters).pipe(
        switchMap((result) => {
          return [result];
        })
      ))
      // toLoadState solo si tiene sentido para estos mocks; así están más flexibles.
    ),
    { initialValue: { status: 'loading' } as LoadState<Page<Employee>> },
  );

  protected applyFilters(change: Pick<EmployeeFilters, 'search' | 'status' | 'category'>): void {
    this.filters.update((current) => ({ ...current, ...change, page: 0 }));
  }

  protected goToPage(page: number): void {
    this.filters.update((current) => ({ ...current, page }));
  }

  protected reload(): void {
    this.reloadCount.update((c) => c + 1);
  }

  protected isAllRecords(): boolean {
    return isShowingAllRecords(this.filters());
  }
}
