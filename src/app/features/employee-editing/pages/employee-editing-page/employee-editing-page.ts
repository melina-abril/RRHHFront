import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Presenta las indicaciones aprobadas sin simular una consulta o un guardado que la API aún no ofrece. */
@Component({
  selector: 'app-employee-editing-page',
  templateUrl: './employee-editing-page.html',
  styleUrl: './employee-editing-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeEditingPage {}
