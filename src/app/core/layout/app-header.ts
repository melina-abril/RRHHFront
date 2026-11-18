import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_NAVIGATION, APP_ROLES as SYSTEM_ROLES, APP_TITLE } from '../../app.navigation';
import { CurrentUser } from '../session/current-user';
import { AppRole, NavigationItem } from './navigation.model';

const APP_ROLES: readonly AppRole[] = SYSTEM_ROLES;
const NAVIGATION: readonly NavigationItem[] = APP_NAVIGATION;

/** El encabezado y el menú comparten el estado del desplegable móvil. */
export const mobileMenuOpen = signal(false);

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <div class="site-header__leading">
        <button class="site-header__menu" type="button" aria-controls="module-navigation" [attr.aria-expanded]="menuOpen()" (click)="menuOpen.set(!menuOpen())">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          Menú
        </button>
        <div class="site-header__brand"><strong>TECHFORB</strong><span class="site-header__divider" aria-hidden="true"></span><span>{{ title }}</span></div>
        <div class="site-header__location">
          <strong>{{ section() }}</strong>
          <span>{{ title }} / {{ section() }}</span>
        </div>
      </div>
      @if (currentUser.user(); as user) {
        <div class="site-header__actions">
          @if (notifications(); as notification) {
            <a class="site-header__notification" [routerLink]="'/' + notification.path" aria-label="Notificaciones" title="Notificaciones">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></svg>
            </a>
          }
          <div class="site-header__identity">
            <span class="site-header__avatar" aria-hidden="true">{{ initials(user.name) }}</span>
            <span class="site-header__identity-text"><strong>{{ user.name }}</strong><small>{{ currentUser.roleLabel() }}</small></span>
          </div>
          @if (canSwitchRole) {
            <label class="site-header__role"><span>Ver como</span>
              <select [value]="user.role ?? ''" (change)="changeRole($event)">
                @for (role of roles; track role.value) {
                  <option [value]="role.value">{{ role.label }}</option>
                }
              </select>
            </label>
          }
          <button class="site-header__logout" type="button" (click)="logout()" [disabled]="leaving()">Cerrar sesión</button>
        </div>
      }
    </header>
  `,
  styles: `
    .site-header { min-height: 64px; padding: 8px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; background: var(--surface, var(--color-surface)); border-bottom: 1px solid var(--border, var(--color-border)); color: var(--text-primary, var(--color-text)); font-family: var(--font-family, Inter, sans-serif); }
    .site-header__leading, .site-header__actions { display: flex; align-items: center; gap: 16px; min-width: 0; }
    .site-header__actions { margin-left: auto; gap: 12px; }
    .site-header__brand { display: flex; align-items: center; gap: 8px; white-space: nowrap; }
    .site-header__brand strong { font-size: 11px; letter-spacing: .03em; }
    .site-header__brand span:last-child { color: var(--primary, var(--color-primary)); font-size: 12px; font-weight: 650; }
    .site-header__divider { width: 1px; height: 18px; background: var(--border, var(--color-border)); }
    .site-header__location { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .site-header__location strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; font-weight: 650; }
    .site-header__location span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text-secondary, var(--color-text-muted)); font-size: 11px; }
    .site-header__notification { width: 40px; height: 40px; display: grid; place-items: center; flex: none; border: 1px solid var(--border, var(--color-border)); border-radius: 8px; color: var(--primary, var(--color-primary)); text-decoration: none; }
    .site-header__notification:hover { background: var(--soft-background, var(--color-surface-muted)); }
    .site-header__identity { display: flex; align-items: center; gap: 9px; }
    .site-header__avatar { width: 36px; height: 36px; display: grid; place-items: center; flex: none; border-radius: 50%; background: var(--active-item, var(--color-surface-muted)); color: var(--primary, var(--color-primary)); font-size: 12px; font-weight: 700; }
    .site-header__identity-text { display: flex; flex-direction: column; gap: 2px; white-space: nowrap; }
    .site-header__identity-text strong { font-size: 12px; font-weight: 650; }
    .site-header__identity-text small { color: var(--text-secondary, var(--color-text-muted)); font-size: 11px; }
    .site-header__role { display: flex; align-items: center; gap: 6px; font-size: 12px; }
    .site-header__role select { max-width: 130px; padding: 6px; border: 1px solid var(--border, var(--color-border)); border-radius: 6px; background: var(--surface, var(--color-surface)); color: var(--text-primary, var(--color-text)); }
    .site-header__logout, .site-header__menu { min-height: 40px; padding: 0 12px; border: 1px solid var(--border, var(--color-border)); border-radius: 8px; background: var(--surface, var(--color-surface)); color: var(--primary, var(--color-primary)); font: 600 12px var(--font-family, Inter, sans-serif); cursor: pointer; white-space: nowrap; }
    .site-header__logout:hover, .site-header__menu:hover { background: var(--soft-background, var(--color-surface-muted)); }
    .site-header__menu { display: none; align-items: center; gap: 7px; }
    :is(a, button, select):focus-visible { outline: 2px solid var(--accent, var(--color-primary)); outline-offset: 2px; }
    @media (max-width: 1100px) { .site-header__brand { display: none; } }
    @media (max-width: 760px) { .site-header { padding: 8px 16px; flex-wrap: wrap; } .site-header__menu { display: inline-flex; } .site-header__identity-text { display: none; } .site-header__actions { gap: 8px; } }
    @media (max-width: 480px) { .site-header__location span { display: none; } .site-header__role { width: 100%; order: 3; } .site-header__role select { max-width: none; } }
  `,
})
export class AppHeader {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly title = APP_TITLE;
  protected readonly roles = APP_ROLES;
  protected readonly canSwitchRole = environment.useMock && APP_ROLES.length > 1;
  protected readonly leaving = signal(false);
  protected readonly menuOpen = mobileMenuOpen;
  private readonly router = inject(Router);
  private readonly url = toSignal(this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), map((event) => event.urlAfterRedirects)), { initialValue: this.router.url });
  protected readonly section = computed(() => {
    const path = this.url().split('?')[0].split('#')[0];
    const match = NAVIGATION.filter((item) => path === '/' + item.path || path.startsWith('/' + item.path + '/')).sort((a, b) => b.path.length - a.path.length)[0];
    return match?.label ?? NAVIGATION[0]?.label ?? this.title;
  });
  protected readonly notifications = computed(() => NAVIGATION.find((item) => /notific/i.test(item.label) && this.currentUser.hasRole(item.roles)));

  protected initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
  }

  protected changeRole(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    this.currentUser.setRole(target.value);
    void this.router.navigateByUrl('/');
  }

  protected logout(): void {
    this.leaving.set(true);
    this.currentUser.logout().subscribe(() => {
      this.leaving.set(false);
      this.menuOpen.set(false);
      void this.router.navigateByUrl('/login');
    });
  }
}
