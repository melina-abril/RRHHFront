import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { EMPTY, expand, map, reduce, switchMap } from 'rxjs';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { Page, toPage } from '../../../../shared/models/page';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_CATEGORY, EMPLOYEE_STATUS, EmployeeResponse } from '../../models/employees.models';

@Component({
  selector: 'app-employees-page',
  imports: [RouterLink, DatePipe, EmptyState, ErrorAlert, LoadingState, StatusBadge],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly employeesService = inject(EmployeesService);
  private readonly reloadCount = signal(0);
  protected readonly searchInput = signal('');
  protected readonly search = signal('');
  protected readonly page = signal(0);
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly categoryInfo = EMPLOYEE_CATEGORY;
  private readonly request = computed(() => ({ search: this.search(), page: this.page(), reload: this.reloadCount() }));

  // El contrato solo admite paginación: se leen todas las páginas antes de filtrar por nombre.
  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(
      switchMap(({ search, page }) => toLoadState(
        this.employeesService.list(0, 100).pipe(
          expand((response) => response.page + 1 < response.totalPages
            ? this.employeesService.list(response.page + 1, 100)
            : EMPTY),
          reduce((items, response) => [...items, ...response.items], [] as EmployeeResponse[]),
          map((items): Page<EmployeeResponse> => {
            const query = search.trim().toLocaleLowerCase();
            const filtered = query
              ? items.filter((employee) => `${employee.firstName} ${employee.lastName}`.toLocaleLowerCase().includes(query))
              : items;
            return toPage(filtered, page, 10);
          }),
        ),
      )),
    ),
    { initialValue: { status: 'loading' } as LoadState<Page<EmployeeResponse>> },
  );

  protected applySearch(): void {
    this.page.set(0);
    this.search.set(this.searchInput().trim());
  }

  protected clearSearch(): void {
    this.searchInput.set('');
    this.applySearch();
  }

  protected goToPage(page: number): void {
    this.page.set(page);
  }

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
