import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Página pública para solicitud de ausencia por enlace seguro (token).
 * Valida el token, muestra el formulario y el estado final del envío.
 */
@Component({
  selector: 'app-solicitud-publica',
  standalone: true,
  template: `
    <main class="solicitud-publica-page">
      <h1>Solicitud de ausencia</h1>
      <p *ngIf="state() === 'validating'">Validando enlace…</p>
      <ng-container *ngIf="state() === 'valid'">
        <!-- Aquí va el formulario de solicitud -->
        <p>Formulario de solicitud (desarrollo futuro).</p>
      </ng-container>
      <p *ngIf="state() === 'invalid'" class="error">El enlace es inválido, vencido o ya ha sido usado.</p>
      <p *ngIf="state() === 'enviado'" class="success">¡Tu solicitud fue enviada correctamente!</p>
    </main>
  `,
  styleUrl: './solicitud-publica-page.scss'
})
export class SolicitudPublicaPage {
  state = signal<'validating'|'valid'|'invalid'|'enviado'>('validating');
  constructor(route: ActivatedRoute) {
    // Validación mock del token, normalmente se llamaría un servicio
    const { token } = route.snapshot.params;
    setTimeout(() => {
      // Simulación: tokens válidos empiezan con 'V'; real sería HTTP con backend
      if (typeof token === 'string' && token.startsWith('V')) {
        this.state.set('valid');
      } else {
        this.state.set('invalid');
      }
    }, 800);
  }
  // Cuando se envíe el formulario, set state a 'enviado'
}
