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
    .site-footer {
      min-height: 48px;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      border-top: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text-muted);
      font-size: 11px;
    }
    @media (max-width: 600px) {
      .site-footer { padding: 12px var(--space-md); }
    }
  `,
})
export class AppFooter {
  protected readonly title = APP_TITLE;
  protected readonly year = new Date().getFullYear();
}
