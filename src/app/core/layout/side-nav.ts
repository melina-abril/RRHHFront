import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_NAVIGATION as SYSTEM_NAVIGATION, APP_TITLE } from '../../app.navigation';
import { CurrentUser } from '../session/current-user';
import { NavigationItem } from './navigation.model';

const APP_NAVIGATION: readonly NavigationItem[] = SYSTEM_NAVIGATION;

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="navigation-container">
      <div class="navigation-brand">
        <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="currentColor" fill-opacity="0.18" />
          <path d="M7 10h18M16 10v14M9 17h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
          <circle cx="23" cy="23" r="3" fill="currentColor" />
        </svg>
        <span><strong>TECHFORB</strong><small>{{ title }}</small></span>
      </div>
      <button class="navigation-toggle" type="button" [attr.aria-expanded]="open()" aria-controls="module-navigation" (click)="open.set(!open())">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        Menú
      </button>
      <nav id="module-navigation" class="navigation" aria-label="Navegación principal" [class.navigation--open]="open()">
        <span class="navigation__heading">NAVEGACIÓN</span>
        @for (item of items(); track item.path) {
          <a class="navigation__link" [routerLink]="'/' + item.path" routerLinkActive="navigation__link--active" ariaCurrentWhenActive="page" (click)="open.set(false)">
            <span class="navigation__icon" aria-hidden="true">
              @if (isHome(item)) {
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" /><path d="M9 21v-7h6v7" /></svg>
              } @else if (isNotifications(item)) {
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></svg>
              } @else if (isEmployees(item)) {
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></svg>
              } @else if (isCalendar(item)) {
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></svg>
              } @else {
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></svg>
              }
            </span>
            {{ item.label }}
          </a>
        }
      </nav>
      @if (currentUser.user(); as user) {
        <div class="navigation-user">
          <span class="navigation-user__avatar" aria-hidden="true">{{ initials(user.name) }}</span>
          <span class="navigation-user__details"><strong>{{ user.name }}</strong><small>{{ currentUser.roleLabel() }}</small></span>
        </div>
      }
    </aside>
  `,
  styles: `
    .navigation-container {
      min-height: 100%;
      padding: 24px 12px 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(160deg, var(--color-primary), var(--accent));
      color: var(--color-on-primary);
    }
    .navigation-brand { padding: 0 12px 16px; display: flex; align-items: center; gap: 11px; border-bottom: 1px solid color-mix(in srgb, var(--color-on-primary) 18%, transparent); }
    .navigation-brand svg { flex: none; }
    .navigation-brand span { display: flex; flex-direction: column; gap: 2px; }
    .navigation-brand strong { font-size: 13px; letter-spacing: 0.04em; }
    .navigation-brand small { font-size: 12px; color: color-mix(in srgb, var(--color-on-primary) 78%, transparent); }
    .navigation { display: flex; flex-direction: column; gap: 2px; }
    .navigation__heading { padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: color-mix(in srgb, var(--color-on-primary) 70%, transparent); }
    .navigation__link { min-height: 40px; padding: 10px 12px; display: flex; align-items: center; gap: 12px; border-left: 3px solid transparent; border-radius: 6px; color: color-mix(in srgb, var(--color-on-primary) 75%, transparent); text-decoration: none; font-size: 13px; line-height: 1.3; }
    .navigation__icon { width: 17px; height: 17px; display: inline-flex; flex: none; align-items: center; justify-content: center; }
    .navigation__link:hover, .navigation__link:focus-visible { background: color-mix(in srgb, var(--color-on-primary) 10%, transparent); color: var(--color-on-primary); }
    .navigation__link--active, .navigation__link--active:hover { border-left-color: var(--color-on-primary); background: color-mix(in srgb, var(--color-on-primary) 15%, transparent); color: var(--color-on-primary); font-weight: 650; }
    .navigation__link:focus-visible, .navigation-toggle:focus-visible { outline: 2px solid var(--color-on-primary); outline-offset: 2px; }
    .navigation-user { margin-top: auto; padding: 12px; display: flex; align-items: center; gap: 10px; border: 1px solid color-mix(in srgb, var(--color-on-primary) 18%, transparent); border-radius: var(--radius); background: color-mix(in srgb, var(--color-on-primary) 9%, transparent); }
    .navigation-user__avatar { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; flex: none; border-radius: 50%; background: var(--color-surface); color: var(--color-primary); font-size: 12px; font-weight: 700; }
    .navigation-user__details { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .navigation-user__details strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
    .navigation-user__details small { color: color-mix(in srgb, var(--color-on-primary) 78%, transparent); font-size: 11px; }
    .navigation-toggle { display: none; }
    @media (max-width: 760px) {
      .navigation-container { min-height: 0; padding: 10px var(--space-md); flex-direction: row; align-items: center; justify-content: space-between; flex-wrap: wrap; }
      .navigation-brand { padding: 0; border: 0; }
      .navigation-toggle { min-height: 40px; padding: 0 10px; display: inline-flex; align-items: center; gap: 7px; border: 1px solid color-mix(in srgb, var(--color-on-primary) 32%, transparent); border-radius: var(--radius); background: transparent; color: var(--color-on-primary); font: 600 12px inherit; cursor: pointer; }
      .navigation { display: none; width: 100%; max-height: 65dvh; overflow-y: auto; }
      .navigation--open { display: flex; }
      .navigation-user { display: none; }
    }
  `,
})
export class SideNav {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly title = APP_TITLE;
  protected readonly open = signal(false);
  protected readonly items = computed(() => APP_NAVIGATION.filter((item) => this.currentUser.hasRole(item.roles)));

  protected initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
  }

  protected isHome(item: NavigationItem): boolean {
    return /inicio|home|dashboard/i.test(item.label + ' ' + item.path);
  }

  protected isNotifications(item: NavigationItem): boolean {
    return /notific|avisos/i.test(item.label + ' ' + item.path);
  }

  protected isEmployees(item: NavigationItem): boolean {
    return /emplead|colaborador|employee/i.test(item.label + ' ' + item.path);
  }

  protected isCalendar(item: NavigationItem): boolean {
    return /calend|feriad|ausencia/i.test(item.label + ' ' + item.path);
  }
}
