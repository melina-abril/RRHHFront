import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { CurrentUser } from '../../../../core/session/current-user';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { DashboardService } from '../../data-access/dashboard.service';
import { DashboardSummaryResponse } from '../../models/dashboard.models';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, ErrorAlert, LoadingState],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly dashboardService = inject(DashboardService);
  private readonly currentUser = inject(CurrentUser);
  private readonly reloadCount = signal(0);

  protected readonly firstName = computed(() => this.currentUser.user()?.name.trim().split(/\s+/)[0] ?? '');
  protected readonly summaryState = toSignal(
    toObservable(this.reloadCount).pipe(
      switchMap(() => toLoadState(this.dashboardService.getDashboardSummary())),
    ),
    { initialValue: { status: 'loading' } as LoadState<DashboardSummaryResponse> },
  );

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
