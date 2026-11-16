import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_CATEGORY, EMPLOYEE_STATUS, Employee, EmployeeCategory, EmployeeFilters, EmployeeStatus } from '../../models/employees.models';

@Component({
  selector: 'app-employees-page',
  imports: [ReactiveFormsModule, RouterLink, PageHeader, LoadingState, ErrorAlert, EmptyState, StatusBadge],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly service = inject(EmployeesService);
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly categories = EMPLOYEE_CATEGORY;
  protected readonly form = inject(NonNullableFormBuilder).group({ search: [''], status: [''], category: [''] });
  protected readonly filters = signal<EmployeeFilters>({ search: '', status: null, category: null, page: 0, size: 10 });
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ filters: this.filters(), reload: this.reloadCount() }));
  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(switchMap(({ filters }) => toLoadState(this.service.list(filters)))),
    { initialValue: { status: 'loading' } as LoadState<Page<Employee>> },
  );

  protected applyFilters(): void {
    const { search, status, category } = this.form.getRawValue();
    this.filters.update((current) => ({ ...current, search: search.trim(),
      status: (status || null) as EmployeeStatus | null,
      category: (category || null) as EmployeeCategory | null, page: 0 }));
  }

  protected clearFilters(): void {
    this.form.reset({ search: '', status: '', category: '' });
    this.applyFilters();
  }

  protected goToPage(page: number): void {
    this.filters.update((current) => ({ ...current, page }));
  }

  protected reload(): void {
    this.reloadCount.update((value) => value + 1);
  }
}
