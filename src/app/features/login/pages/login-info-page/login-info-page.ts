import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Info institucional y reglas de acceso para el login de administradores RRHH.
 * Solo se muestra en la pantalla de inicio de sesión, junto al formulario ya existente.
 */
@Component({
  selector: 'app-login-info-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-info-page.html',
  styleUrl: './login-info-page.scss',
})
export class LoginInfoPage {}
