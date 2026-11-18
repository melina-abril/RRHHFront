import { ChangeDetectionStrategy, Component } from '@angular/core';
import { APP_TITLE } from '../../app.navigation';

/**
 * Pie fijo: nombre del sistema y año. La estructura del frontend lo reescribe con lo que pida "Estructura de la
 * aplicación" (contacto, versión…), sin cambiar el selector ni el export.
 */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="site-footer">
      <div class="site-footer__inner">
        <span>© {{ year }} {{ title }}</span>
      </div>
    </footer>
  `,
  styles: `
    .site-footer { border-top: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-muted); font-size: 0.875rem; }
    .site-footer__inner { max-width: 100rem; margin: auto; padding: var(--space-md) var(--space-lg); display: flex; flex-wrap: wrap; gap: var(--space-md); }
    @media (max-width: 600px) { .site-footer__inner { padding: var(--space-md); } }
  `,
})
export class AppFooter {
  protected readonly title = APP_TITLE;
  protected readonly year = new Date().getFullYear();
}
