import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { DashboardService } from '../../data-access/dashboard.service';
import { DashboardSummaryResponse } from '../../models/dashboard.models';

interface QuickAccessItem {
  title: string;
  description: string;
  path: string | null;
  iconPath: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink, ErrorAlert, LoadingState],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly dashboardService = inject(DashboardService);
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => this.reloadCount());

  protected readonly summaryState = toSignal(
    toObservable(this.request).pipe(switchMap(() => toLoadState(this.dashboardService.getDashboardSummary()))),
    { initialValue: { status: 'loading' } as LoadState<DashboardSummaryResponse> },
  );

  // Los módulos sin pantalla implementada se muestran sin enlace.
  protected readonly quickAccess: readonly QuickAccessItem[] = [
    {
      title: 'Gestión de Empleados',
      description: 'Legajos, perfiles y asignaciones',
      path: '/employee-management',
      iconPath: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 20v-2a6 6 0 0 1 12 0v2H3Zm14-15a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 5',
    },
    {
      title: 'Sueldos y Bonos',
      description: 'Remuneraciones y beneficios',
      path: null,
      iconPath: 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM5 9h1m12 6h1',
    },
    {
      title: 'Solicitudes',
      description: 'Revisión y seguimiento de pedidos',
      path: null,
      iconPath: 'M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 5h8m-8 4h8m-8 4h4',
    },
    {
      title: 'Comunicados',
      description: 'Mensajes y registro de envíos',
      path: null,
      iconPath: 'M3 5h18v13H8l-5 3V5Zm4 5h10m-10 4h7',
    },
    {
      title: 'Horas Extras',
      description: 'Autorizaciones y compensaciones',
      path: null,
      iconPath: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2',
    },
  ];

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
