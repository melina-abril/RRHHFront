import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
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
import { EMPLOYEE_CATEGORY, EMPLOYEE_STATUS, EmployeeListQuery, EmployeeResponse } from '../../models/employee-management.models';

@Component({
  selector: 'app-employees-page',
  imports: [ReactiveFormsModule, RouterLink, PageHeader, LoadingState, EmptyState, ErrorAlert, StatusBadge],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly service = inject(EmployeeManagementService);
  private readonly currentUser = inject(CurrentUser);
  protected readonly canCreate = computed(() => this.currentUser.hasRole(['ADMIN']));
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly categoryInfo = EMPLOYEE_CATEGORY;
  protected readonly form = inject(NonNullableFormBuilder).group({ search: [''] });
  protected readonly filters = signal<EmployeeListQuery>({ search: '', page: 0, size: 10 });
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ query: this.filters(), reload: this.reloadCount() }));
  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(switchMap(({ query }) => toLoadState(this.service.listEmployees(query)))),
    { initialValue: { status: 'loading' } as LoadState<Page<EmployeeResponse>> },
  );

  protected search(): void {
    this.filters.update((current) => ({ ...current, search: this.form.controls.search.value.trim(), page: 0 }));
  }

  protected clear(): void {
    this.form.controls.search.setValue('');
    this.search();
  }

  protected goToPage(page: number): void {
    this.filters.update((current) => ({ ...current, page }));
  }

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
