import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
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
      <div class="site-header__brand">
        <strong>TECHFORB</strong>
        <span class="site-header__divider" aria-hidden="true"></span>
        <span>{{ title }}</span>
      </div>
      <div class="site-header__location">
        <strong>{{ section() }}</strong>
        <span>{{ title }} / {{ section() }}</span>
      </div>
      @if (currentUser.user(); as user) {
        <div class="site-header__actions">
          @if (notifications(); as notificationItem) {
            <a class="site-header__notifications" [routerLink]="'/' + notificationItem.path" aria-label="Notificaciones" title="Notificaciones">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
              </svg>
            </a>
          }
          <div class="site-header__identity">
            <span class="site-header__avatar" aria-hidden="true">{{ initials(user.name) }}</span>
            <span class="site-header__user">
              <strong>{{ user.name }}</strong>
              @if (currentUser.roleLabel(); as roleLabel) {
                <small>{{ roleLabel }}</small>
              }
            </span>
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
    .site-header {
      min-height: 64px;
      padding: 8px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text);
    }
    .site-header__brand { display: flex; align-items: center; gap: 8px; white-space: nowrap; font-size: 11px; letter-spacing: 0.03em; }
    .site-header__brand span:last-child { color: var(--color-primary); font-size: 12px; font-weight: 650; }
    .site-header__divider { width: 1px; height: 18px; background: var(--color-border); }
    .site-header__location { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .site-header__location strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 14px; font-weight: 650; }
    .site-header__location span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--color-text-muted); font-size: 11px; }
    .site-header__actions { margin-left: auto; display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: 12px; }
    .site-header__notifications { width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--color-border); border-radius: var(--radius); color: var(--color-primary); text-decoration: none; }
    .site-header__notifications:hover { background: var(--color-primary-soft); }
    .site-header__identity { display: flex; align-items: center; gap: 9px; }
    .site-header__avatar { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex: none; border-radius: 50%; background: var(--active-item); color: var(--color-primary); font-size: 12px; font-weight: 700; }
    .site-header__user { display: flex; flex-direction: column; gap: 2px; white-space: nowrap; }
    .site-header__user strong { font-size: 12px; font-weight: 650; }
    .site-header__user small { color: var(--color-text-muted); font-size: 11px; }
    .site-header__role { display: grid; gap: 2px; font-size: 11px; }
    .site-header__role select { max-width: 140px; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-text); }
    .site-header__logout { min-height: 36px; padding: 0 10px; border: 1px solid var(--color-border); border-radius: var(--radius); background: var(--color-surface); color: var(--color-primary); font: 600 12px inherit; cursor: pointer; }
    .site-header__logout:hover { background: var(--color-primary-soft); }
    .site-header__notifications:focus-visible, .site-header__logout:focus-visible, .site-header__role select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    @media (max-width: 900px) { .site-header__brand { display: none; } }
    @media (max-width: 600px) { .site-header { padding: 8px var(--space-md); flex-wrap: wrap; } .site-header__actions { width: 100%; justify-content: flex-start; } }
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
    startWith(this.router.url),
  ), { initialValue: this.router.url });
  private readonly activeItem = computed(() => {
    const pathname = this.url().split(/[?#]/, 1)[0];
    return [...NAVIGATION]
      .filter((item) => pathname === '/' + item.path || pathname.startsWith('/' + item.path + '/'))
      .sort((left, right) => right.path.length - left.path.length)[0];
  });
  protected readonly section = computed(() => this.activeItem()?.label ?? this.title);
  protected readonly notifications = computed(() => NAVIGATION.find((item) =>
    /notific|avisos/i.test(item.label + ' ' + item.path) && this.currentUser.hasRole(item.roles),
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
