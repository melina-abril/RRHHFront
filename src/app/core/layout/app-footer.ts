import { ChangeDetectionStrategy, Component } from '@angular/core';
import { APP_TITLE } from '../../app.navigation';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="site-footer">
      <span>© {{ year }} TECHFORB · {{ title }}</span>
      <span>Versión 1.0.0</span>
    </footer>
  `,
  styles: `
    .site-footer { box-sizing: border-box; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; min-height: 48px; padding: 12px 24px; border-top: 1px solid var(--border, var(--color-border)); background: var(--surface, var(--color-surface)); color: var(--text-secondary, var(--color-text-muted)); font: 11px var(--font-family, Inter, sans-serif); }
    @media (max-width: 600px) { .site-footer { padding: 12px 16px; } }
  `,
})
export class AppFooter {
  protected readonly title = APP_TITLE;
  protected readonly year = new Date().getFullYear();
}
