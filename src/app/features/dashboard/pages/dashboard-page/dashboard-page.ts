import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Pantalla principal de inicio: orientativa, sin datos dinámicos ni llamadas.
 * Los accesos rápidos van hardcodeados según lo que indica la historia de usuario y el mockup.
 */
@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
