import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Pantalla de inicio de sesión de TECHFORB RH: muestra la identificación, textos descriptivos del sistema y
 * el acceso exclusivo para administración de RH, con el aviso para colaboradores.
 * El formulario y su comportamiento real lo provee el LoginPage FIJO de core/session/login-page.ts,
 * que debe mostrarse en contexto con el layout y avisos requeridos por las historias y la maqueta aprobada.
 */
@Component({
  selector: 'app-auth-login-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLoginPage {}
