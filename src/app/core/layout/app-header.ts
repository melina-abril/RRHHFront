import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APP_NAVIGATION, APP_ROLES as SYSTEM_ROLES, APP_TITLE } from '../../app.navigation';
import { CurrentUser } from '../session/current-user';
import { AppRole } from './navigation.model';

const APP_ROLES: readonly AppRole[] = SYSTEM_ROLES;

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <div class="site-header__identity">
        <span class="site-header__brand">TECHFORB</span>
        <span class="site-header__divider" aria-hidden="true"></span>
        <span class="site-header__product">{{ title }}</span>
      </div>
      <div class="site-header__location">
        <strong>{{ section() }}</strong>
        <span>{{ title }} / {{ section() }}</span>
      </div>
      @if (currentUser.user(); as user) {
        <div class="site-header__actions">
          @if (notificationsPath(); as path) {
            <a class="site-header__notifications" [routerLink]="'/' + path" aria-label="Notificaciones" title="Notificaciones">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" />
              </svg>
            </a>
          }
          <div class="site-header__person">
            <span class="site-header__avatar" aria-hidden="true">{{ initials(user.name) }}</span>
            <span class="site-header__user">
              <strong>{{ user.name }}</strong>
              <small>{{ currentUser.roleLabel() }}</small>
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
    .site-header { display: flex; align-items: center; gap: 20px; min-height: 64px; padding: 8px 24px; border-bottom: 1px solid var(--border); background: var(--surface); color: var(--text-primary); }
    .site-header__identity { display: flex; align-items: center; gap: 8px; flex: none; white-space: nowrap; }
    .site-header__brand { font-size: 11px; font-weight: 700; letter-spacing: 0.03em; }
    .site-header__divider { width: 1px; height: 18px; background: var(--border); }
    .site-header__product { color: var(--primary); font-size: 12px; font-weight: 650; }
    .site-header__location { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .site-header__location strong { overflow: hidden; font-size: 14px; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
    .site-header__location > span { overflow: hidden; color: var(--text-secondary); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
    .site-header__actions { display: flex; align-items: center; gap: 12px; margin-left: auto; }
    .site-header__notifications { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--primary); }
    .site-header__notifications:hover { background: var(--soft-background); }
    .site-header__person { display: flex; align-items: center; gap: 9px; }
    .site-header__avatar { display: flex; flex: none; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: var(--active-item); color: var(--primary); font-size: 12px; font-weight: 700; }
    .site-header__user { display: flex; flex-direction: column; gap: 2px; white-space: nowrap; }
    .site-header__user strong { font-size: 12px; font-weight: 650; }
    .site-header__user small { color: var(--text-secondary); font-size: 11px; }
    .site-header__role { display: flex; flex-direction: column; gap: 2px; color: var(--text-secondary); font-size: 11px; }
    .site-header__role select { max-width: 140px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); color: var(--text-primary); font: inherit; }
    .site-header__logout { min-height: 40px; padding: 0 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--primary); font: 600 12px var(--font-family); cursor: pointer; white-space: nowrap; }
    .site-header__logout:hover { background: var(--soft-background); }
    .site-header__notifications:focus-visible, .site-header__logout:focus-visible, .site-header__role select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    @media (max-width: 1050px) { .site-header { flex-wrap: wrap; } .site-header__actions { flex-wrap: wrap; justify-content: flex-end; } }
    @media (max-width: 600px) { .site-header { gap: 10px; padding: 12px 16px; } .site-header__location { order: 3; width: 100%; } .site-header__actions { gap: 8px; } .site-header__user { display: none; } .site-header__role { order: 4; } }
  `,
})
export class AppHeader {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly title = APP_TITLE;
  protected readonly roles = APP_ROLES;
  protected readonly canSwitchRole = environment.useMock && APP_ROLES.length > 1;
  protected readonly leaving = signal(false);
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );
  protected readonly section = computed(() => {
    const path = this.url().split(/[?#]/, 1)[0];
    const item = APP_NAVIGATION.filter((entry) => this.currentUser.hasRole(entry.roles))
      .filter((entry) => path === '/' + entry.path || path.startsWith('/' + entry.path + '/'))
      .sort((left, right) => right.path.length - left.path.length)[0];
    return item?.label ?? this.title;
  });
  protected readonly notificationsPath = computed(() => {
    const item = APP_NAVIGATION.find((entry) =>
      /notific/i.test(entry.path + ' ' + entry.label) && this.currentUser.hasRole(entry.roles),
    );
    return item?.path ?? null;
  });

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
