import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Pantalla de explicación/adición: muestra la información sobre el acceso exclusivo para RH,
 * la leyenda y alerta de colaboradores, en la pantalla de inicio de sesión.
 * Se muestra junto al LoginPage ya existente; se importa en app.core/session/login-page.ts.
 * Como la pantalla de login ya existe y solo se modifican los textos y entorno, este componente solo expone
 * el bloque informativo y el aviso para ser incluido en la página del login. No tiene lógica ni estado.
 */
@Component({
  selector: 'app-login-explanation',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-explanation-page.html',
  styleUrl: './login-explanation-page.scss',
})
export class LoginExplanationPage {
}
