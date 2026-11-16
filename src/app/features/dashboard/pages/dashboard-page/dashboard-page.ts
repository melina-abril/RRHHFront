import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { DashboardService } from '../../data-access/dashboard.service';
import { DashboardSummaryResponse } from '../../models/dashboard.models';

@Component({
  selector: 'app-dashboard-page',
  imports: [DatePipe, RouterLink, EmptyState, ErrorAlert, LoadingState],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly dashboardService = inject(DashboardService);
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ reload: this.reloadCount() }));

  protected readonly summaryState = toSignal(
    toObservable(this.request).pipe(
      switchMap(() => toLoadState(this.dashboardService.getDashboardSummary())),
    ),
    { initialValue: { status: 'loading' } as LoadState<DashboardSummaryResponse> },
  );

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
