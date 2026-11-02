import { ChangeDetectionStrategy, Component } from '@angular/core';

/** El contrato actual no ofrece identificación, historial ni registro de movimientos. */
@Component({
  selector: 'app-employment-movements-page',
  templateUrl: './employment-movements-page.html',
  styleUrl: './employment-movements-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentMovementsPage {}
