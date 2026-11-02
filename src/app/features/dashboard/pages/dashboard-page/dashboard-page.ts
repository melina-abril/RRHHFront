import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader } from '../../../../shared/components/page-header';

/** Pantalla principal de inicio con orientación y accesos rápidos. Indicadores dummy; links a módulos definidos. */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [PageHeader, RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
