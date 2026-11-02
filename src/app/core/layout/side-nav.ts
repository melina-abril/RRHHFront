import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_NAVIGATION } from '../../app.navigation';
import { CurrentUser } from '../session/current-user';

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="navigation-container">
      <button
        class="navigation-toggle button button--secondary"
        type="button"
        [attr.aria-expanded]="open()"
        aria-controls="module-navigation"
        (click)="open.set(!open())"
      >
        Secciones ☰
      </button>
      <nav id="module-navigation" class="navigation" aria-label="Secciones del sistema" [class.navigation--open]="open()">
        @for (item of items(); track item.path) {
          <a
            class="navigation__link"
            [routerLink]="'/' + item.path"
            routerLinkActive="navigation__link--active"
            ariaCurrentWhenActive="page"
            (click)="open.set(false)"
            >{{ item.label }}</a
          >
        }
      </nav>
    </div>
  `,
  styles: `
    .navigation-container { padding: var(--space-lg) var(--space-md); }
    .navigation { display: grid; gap: var(--space-xs); }
    .navigation__link { display: block; border-radius: var(--radius); padding: var(--space-sm) var(--space-md); color: var(--color-text); text-decoration: none; }
    .navigation__link:hover, .navigation__link:focus-visible { background: var(--color-surface-muted); }
    .navigation__link--active, .navigation__link--active:hover { background: var(--color-primary); color: var(--color-on-primary); }
    .navigation-toggle { display: none; }
    @media (max-width: 760px) {
      .navigation-container { padding: var(--space-sm) var(--space-md); border-bottom: 1px solid var(--color-border); }
      .navigation-toggle { display: inline-flex; }
      .navigation { display: none; padding-top: var(--space-sm); }
      .navigation--open { display: grid; }
    }
  `,
})
export class SideNav {
  private readonly currentUser = inject(CurrentUser);
  protected readonly open = signal(false);
  protected readonly items = computed(() => APP_NAVIGATION.filter((item) => this.currentUser.hasRole(item.roles)));
}
