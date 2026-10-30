import { ChangeDetectionStrategy, Component } from '@angular/core';
import { computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { LoadingState } from '../../../../shared/components/loading-state';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { PageHeader } from '../../../../shared/components/page-header';
import { MainDashboardService } from '../../data-access/main-dashboard.service';
import {
  DASHBOARD_EMPTY_LABELS,
  DASHBOARD_INDICATOR_LABELS,
  DashboardResponse
} from '../../models/main-dashboard.models';

@Component({
  selector: 'app-main-dashboard-page',
  imports: [RouterLink, PageHeader, LoadingState, EmptyState, ErrorAlert],
  templateUrl: './main-dashboard-page.html',
  styleUrl: './main-dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainDashboardPage {
  private readonly service = inject(MainDashboardService);

  /** Estado de carga principal del resumen. */
  protected readonly dashboardState = toSignal(
    toObservable(signal(0)).pipe(switchMap(() => this.service.getDashboardIndicators())),
    { initialValue: { status: 'loading' } },
  );

  protected readonly indicatorLabels = DASHBOARD_INDICATOR_LABELS;
  protected readonly emptyLabels = DASHBOARD_EMPTY_LABELS;

  /** Links de los accesos rápidos a módulos. Podrán ajustarse si la navegación cambia (ver moduleKey/slug). */
  protected getModulePath(moduleKey: string): string {
    switch (moduleKey) {
      case 'employees': return '/empleados';
      case 'payroll': return '/sueldos-y-bonos';
      case 'requests': return '/solicitudes';
      case 'notices': return '/comunicados';
      case 'extra-hours': return '/horas-extras';
      default: return '/';
    }
  }
}
