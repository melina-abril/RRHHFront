import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { APP_NAVIGATION as SYSTEM_NAVIGATION, APP_TITLE } from '../../app.navigation';
import { CurrentUser } from '../session/current-user';
import { NavigationItem } from './navigation.model';

const APP_NAVIGATION: readonly NavigationItem[] = SYSTEM_NAVIGATION;

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidebar" aria-label="Navegación principal">
      <div class="sidebar__brand">
        <span class="sidebar__brand-icon" aria-hidden="true">
          <svg width="23" height="23" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M8 6v12m8-12v12M5 18h14" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" />
          </svg>
        </span>
        <span class="sidebar__brand-text">
          <strong>{{ title }}</strong>
          <small>Recursos Humanos</small>
        </span>
        <button class="sidebar__toggle" type="button" aria-controls="module-navigation" [attr.aria-expanded]="open()" [attr.aria-label]="open() ? 'Cerrar menú' : 'Abrir menú'" (click)="open.set(!open())">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <nav id="module-navigation" class="sidebar__navigation" aria-label="Módulos" [class.sidebar__navigation--open]="open()">
        @for (item of items(); track item.path) {
          <a class="sidebar__link" [routerLink]="'/' + item.path" routerLinkActive="sidebar__link--active" ariaCurrentWhenActive="page" (click)="open.set(false)">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              @if (item.path === 'dashboard') {
                <path d="m3 10 9-7 9 7v10H3V10Zm6 10v-7h6v7" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
              } @else if (item.path === 'employees') {
                <circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.8" />
                <path d="M3 19a6 6 0 0 1 12 0H3Zm14-9h4m-2-2v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              } @else {
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.8" />
              }
            </svg>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
      <div class="sidebar__footer">
        @if (currentUser.user(); as user) {
          <div class="sidebar__profile">
            <span class="sidebar__avatar" aria-hidden="true">{{ user.name.slice(0, 1).toUpperCase() }}</span>
            <span class="sidebar__profile-text">
              <strong>{{ user.name }}</strong>
              @if (currentUser.roleLabel(); as roleLabel) {
                <small>{{ roleLabel }}</small>
              }
            </span>
          </div>
        }
        <button class="sidebar__logout" type="button" [disabled]="leaving()" (click)="logout()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h5M14 16l4-4-4-4m4 4H9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  `,
  styles: `
    .sidebar {
      position: sticky;
      top: 0;
      height: 100dvh;
      min-height: 0;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background: var(--primary);
      color: var(--surface);
    }
    .sidebar__brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 36px;
      padding: 4px 8px;
    }
    .sidebar__brand-icon {
      width: 38px;
      height: 38px;
      flex: none;
      display: grid;
      place-items: center;
      border: 1px solid color-mix(in srgb, var(--surface) 35%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--surface) 12%, transparent);
    }
    .sidebar__brand-text {
      min-width: 0;
      display: grid;
      gap: 2px;
      line-height: 1.25;
    }
    .sidebar__brand-text strong {
      font-size: 14px;
      letter-spacing: 0.03em;
    }
    .sidebar__brand-text small {
      font-size: 12px;
      opacity: 0.8;
    }
    .sidebar__toggle {
      display: none;
    }
    .sidebar__navigation {
      display: grid;
      align-content: start;
      gap: 5px;
    }
    .sidebar__link {
      min-height: 44px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-radius: 8px;
      color: var(--surface);
      text-decoration: none;
      font-size: 13px;
      opacity: 0.82;
    }
    .sidebar__link svg {
      flex: none;
    }
    .sidebar__link:hover,
    .sidebar__link:focus-visible,
    .sidebar__link--active {
      background: var(--active-item);
      color: var(--primary);
      opacity: 1;
    }
    .sidebar__link--active {
      font-weight: 600;
    }
    .sidebar__footer {
      display: grid;
      gap: 12px;
      margin-top: auto;
      padding-top: 24px;
    }
    .sidebar__profile {
      min-width: 0;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid color-mix(in srgb, var(--surface) 19%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--surface) 10%, transparent);
    }
    .sidebar__avatar {
      width: 34px;
      height: 34px;
      flex: none;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--surface) 22%, transparent);
      font-size: 12px;
      font-weight: 700;
    }
    .sidebar__profile-text {
      min-width: 0;
      display: grid;
      gap: 2px;
    }
    .sidebar__profile-text strong {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
    }
    .sidebar__profile-text small {
      font-size: 11px;
      opacity: 0.8;
    }
    .sidebar__logout {
      min-height: 44px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid color-mix(in srgb, var(--surface) 19%, transparent);
      border-radius: 8px;
      background: color-mix(in srgb, var(--surface) 10%, transparent);
      color: var(--surface);
      font: inherit;
      font-size: 13px;
      text-align: left;
      cursor: pointer;
    }
    .sidebar__logout:disabled {
      opacity: 0.6;
      cursor: wait;
    }
    .sidebar__toggle:focus-visible,
    .sidebar__link:focus-visible,
    .sidebar__logout:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    @media (max-width: 760px) {
      .sidebar {
        position: relative;
        height: auto;
        padding: 12px 16px;
      }
      .sidebar__brand {
        margin: 0;
        padding: 0;
      }
      .sidebar__toggle {
        width: 40px;
        height: 40px;
        margin-left: auto;
        display: grid;
        place-items: center;
        border: 1px solid color-mix(in srgb, var(--surface) 25%, transparent);
        border-radius: 8px;
        background: color-mix(in srgb, var(--surface) 13%, transparent);
        color: var(--surface);
        cursor: pointer;
      }
      .sidebar__navigation,
      .sidebar__footer {
        display: none;
      }
      .sidebar__navigation--open {
        display: grid;
        margin-top: 16px;
      }
      .sidebar:has(.sidebar__navigation--open) .sidebar__footer {
        display: grid;
      }
    }
  `,
})
export class SideNav {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly title = APP_TITLE;
  protected readonly open = signal(false);
  protected readonly leaving = signal(false);
  protected readonly items = computed(() => APP_NAVIGATION.filter((item) => this.currentUser.hasRole(item.roles)));
  private readonly router = inject(Router);

  protected logout(): void {
    this.leaving.set(true);
    this.currentUser.logout().subscribe(() => {
      this.leaving.set(false);
      void this.router.navigateByUrl('/login');
    });
  }
}
