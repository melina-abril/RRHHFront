import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface QuickAccess {
  path: string;
  title: string;
  description: string;
  icon: string;
}

interface SummaryItem {
  path: string;
  label: string;
  value: number;
  message: string;
  icon: string;
}

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterLink],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  // El contrato no expone un servicio de resumen; estos valores son informativos hasta que esté disponible.
  protected readonly summary: readonly SummaryItem[] = [
    { path: '/employees', label: 'Colaboradores activos', value: 0, message: 'Sin colaboradores activos registrados', icon: 'people' },
    { path: '/requests', label: 'Solicitudes pendientes', value: 0, message: 'Sin solicitudes para revisar', icon: 'request' },
    { path: '/employees', label: 'Próximos eventos', value: 0, message: 'Cumpleaños y beneficios por vencer', icon: 'calendar' },
  ];

  protected readonly quickAccess: readonly QuickAccess[] = [
    { path: '/employees', title: 'Gestión de Empleados', description: 'Legajos, perfiles y asignaciones', icon: 'people' },
    { path: '/payroll', title: 'Sueldos y Bonos', description: 'Remuneraciones y beneficios', icon: 'money' },
    { path: '/requests', title: 'Solicitudes', description: 'Revisión y seguimiento de pedidos', icon: 'request' },
    { path: '/notices', title: 'Comunicados', description: 'Mensajes y registro de envíos', icon: 'message' },
    { path: '/overtime', title: 'Horas Extras', description: 'Autorizaciones y compensaciones', icon: 'clock' },
  ];
}
