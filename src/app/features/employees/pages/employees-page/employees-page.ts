import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
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
import { EMPLOYEE_STATUS, EmployeeResponse } from '../../models/employees.models';

@Component({
  selector: 'app-employees-page',
  imports: [RouterLink, DatePipe, EmptyState, ErrorAlert, LoadingState, PageHeader, StatusBadge],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly employeesService = inject(EmployeesService);
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly page = signal(0);
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ page: this.page(), reload: this.reloadCount() }));
  protected readonly employeesState = toSignal(
    toObservable(this.request).pipe(switchMap(({ page }) => toLoadState(this.employeesService.list(page, 10)))),
    { initialValue: { status: 'loading' } as LoadState<Page<EmployeeResponse>> },
  );

  protected goToPage(page: number): void {
    this.page.set(page);
  }

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
