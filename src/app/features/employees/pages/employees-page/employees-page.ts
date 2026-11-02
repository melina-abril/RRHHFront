import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { EmptyState } from '../../../../shared/components/empty-state';
import { EmployeeFiltersBar } from '../../components/employee-filters-bar';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_STATUS, Employee, EmployeeFilters } from '../../models/employees.models';

@Component({
  selector: 'app-employees-page',
  imports: [RouterLink, DatePipe, PageHeader, LoadingState, ErrorAlert, EmptyState, StatusBadge, EmployeeFiltersBar],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly employeesService = inject(EmployeesService);
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly filters = signal<EmployeeFilters>({
    search: '',
    status: null,
    departmentId: null,
    positionId: null,
    page: 0,
    size: 10,
  });
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ filters: this.filters(), reload: this.reloadCount() }));

  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(switchMap(({ filters }) => this.employeesService.list(filters))),
    { initialValue: { status: 'loading' } as LoadState<Page<Employee>> },
  );

  protected applyFilters(change: Partial<EmployeeFilters>): void {
    this.filters.update((current) => ({ ...current, ...change, page: 0 }));
  }

  protected goToPage(page: number): void {
    this.filters.update((current) => ({ ...current, page }));
  }

  protected reload(): void {
    this.reloadCount.update((n) => n + 1);
  }

  /** Muestra "Todos los registros" solo si búsqueda y filtros tienen valores iniciales. */
  protected readonly showAllRecords = computed(() => {
    const f = this.filters();
    return !f.search && !f.status && !f.departmentId && !f.positionId;
  });
}
