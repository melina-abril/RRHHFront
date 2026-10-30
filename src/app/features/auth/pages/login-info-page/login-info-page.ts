import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Pantalla informativa de inicio de sesión para TECHFORB RH, según historia HU-026.
 * Solo textos visibles alrededor del formulario, sin lógica de sesión ni formulario nuevo.
 * Se muestra antes/después del login y al mostrar el error (layout fijo).
 * NO reemplaza ni extiende la pantalla de login backend-protegida; solo brinda información contextual requerida por la historia.
 */
@Component({
  selector: 'app-login-info-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-info-page.html',
  styleUrl: './login-info-page.scss',
})
export class LoginInfoPage {}
