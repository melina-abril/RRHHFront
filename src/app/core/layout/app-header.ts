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

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <div class="site-header__section">
        <div class="site-header__brand"><strong>TECHFORB</strong><span aria-hidden="true"></span><span>{{ title }}</span></div>
        <div class="site-header__location">
          <strong>{{ section() }}</strong>
          <span>{{ title }} / {{ section() }}</span>
        </div>
      </div>
      @if (currentUser.user(); as user) {
        <div class="site-header__actions">
          @if (notifications(); as notification) {
            <a class="site-header__notification" [routerLink]="'/' + notification.path" aria-label="Notificaciones" title="Notificaciones">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></svg>
            </a>
          }
          <div class="site-header__user">
            <span class="site-header__avatar" aria-hidden="true">{{ initials(user.name) }}</span>
            <span class="site-header__identity"><strong>{{ user.name }}</strong><small>{{ currentUser.roleLabel() }}</small></span>
          </div>
          @if (canSwitchRole) {
            <label class="site-header__role">
              <span>Ver como</span>
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
    .site-header { min-height: 64px; padding: 8px 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px; background: var(--surface, var(--color-surface)); border-bottom: 1px solid var(--border, var(--color-border)); color: var(--text-primary, var(--color-text)); }
    .site-header__section { min-width: 0; display: flex; align-items: center; gap: 16px; }
    .site-header__brand { display: flex; align-items: center; gap: 8px; white-space: nowrap; font-size: 11px; letter-spacing: .03em; }
    .site-header__brand span:first-of-type { width: 1px; height: 18px; background: var(--border, var(--color-border)); }
    .site-header__brand span:last-of-type { font-size: 12px; font-weight: 650; color: var(--primary, var(--color-primary)); }
    .site-header__location { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .site-header__location strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; font-weight: 650; }
    .site-header__location > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: var(--text-secondary, var(--color-text-muted)); }
    .site-header__actions { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 12px; }
    .site-header__notification { width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--border, var(--color-border)); border-radius: 8px; background: var(--surface, var(--color-surface)); color: var(--primary, var(--color-primary)); }
    .site-header__notification:hover { background: var(--soft-background, var(--color-surface-muted)); }
    .site-header__user { display: flex; align-items: center; gap: 9px; min-width: 0; }
    .site-header__avatar { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; flex: none; border-radius: 50%; background: var(--active-item, var(--color-surface-muted)); color: var(--primary, var(--color-primary)); font-size: 12px; font-weight: 700; }
    .site-header__identity { display: flex; flex-direction: column; gap: 2px; white-space: nowrap; }
    .site-header__identity strong { font-size: 12px; font-weight: 650; }
    .site-header__identity small { font-size: 11px; color: var(--text-secondary, var(--color-text-muted)); }
    .site-header__role { display: grid; gap: 2px; font-size: 11px; color: var(--text-secondary, var(--color-text-muted)); }
    .site-header__role select { max-width: 150px; border: 1px solid var(--border, var(--color-border)); border-radius: 6px; background: var(--surface, var(--color-surface)); color: var(--text-primary, var(--color-text)); }
    .site-header__logout { min-height: 40px; padding: 0 12px; border: 1px solid var(--border, var(--color-border)); border-radius: 8px; background: var(--surface, var(--color-surface)); color: var(--primary, var(--color-primary)); font: 600 12px var(--font-family); cursor: pointer; }
    .site-header__logout:hover { background: var(--soft-background, var(--color-surface-muted)); }
    .site-header__logout:disabled { opacity: .6; cursor: wait; }
    .site-header :is(a, button, select):focus-visible { outline: 2px solid var(--accent, var(--color-primary)); outline-offset: 2px; }
    @media (max-width: 760px) { .site-header { padding-left: 100px; flex-wrap: wrap; } .site-header__section { flex-wrap: wrap; gap: 5px 12px; } }
    @media (max-width: 540px) { .site-header { padding-right: 12px; } .site-header__brand { display: none; } .site-header__identity { display: none; } }
  `,
})
export class AppHeader {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly title = APP_TITLE;
  protected readonly roles = APP_ROLES;
  protected readonly canSwitchRole = environment.useMock && APP_ROLES.length > 1;
  protected readonly leaving = signal(false);
  private readonly router = inject(Router);
  private readonly url = toSignal(this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map((event) => event.urlAfterRedirects),
  ), { initialValue: this.router.url });
  protected readonly section = computed(() => {
    const path = this.url().split('?')[0].split('#')[0];
    const match = NAVIGATION.filter((item) => this.currentUser.hasRole(item.roles))
      .filter((item) => path === '/' + item.path || path.startsWith('/' + item.path + '/'))
      .sort((a, b) => b.path.length - a.path.length)[0];
    return match?.label ?? this.title;
  });
  protected readonly notifications = computed(() => NAVIGATION.find((item) =>
    this.currentUser.hasRole(item.roles) && /notificaciones|notifications/i.test(item.label + ' ' + item.path),
  ));

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
      void this.router.navigateByUrl('/login');
    });
  }
}
