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
    <aside class="sidebar">
      <div class="sidebar__top">
        <div class="sidebar__brand">
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="currentColor" fill-opacity=".18" />
            <path d="M7 10h18M16 10v14M9 17h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
            <circle cx="23" cy="23" r="3" fill="currentColor" />
          </svg>
          <span class="sidebar__brand-text"><strong>TECHFORB</strong><span>{{ title }}</span></span>
        </div>
        <button class="sidebar__toggle" type="button" [attr.aria-expanded]="open()" aria-controls="module-navigation" (click)="open.set(!open())">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          Menú
        </button>
      </div>
      <nav id="module-navigation" class="sidebar__nav" aria-label="Navegación principal" [class.sidebar__nav--open]="open()">
        <span class="sidebar__caption">NAVEGACIÓN</span>
        @for (item of items(); track item.path) {
          <a class="sidebar__link" [routerLink]="'/' + item.path" routerLinkActive="sidebar__link--active" ariaCurrentWhenActive="page" (click)="open.set(false)">
            <svg class="sidebar__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              @switch (iconFor(item)) {
                @case ('home') { <path d="m3 11 9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /> }
                @case ('employees') { <circle cx="12" cy="7" r="3" /><path d="M5 21v-2a7 7 0 0 1 14 0v2H5Z" /> }
                @case ('notifications') { <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /> }
                @case ('calendar') { <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 10h18" /> }
                @case ('money') { <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 9h20m-15 6h3" /> }
                @default { <rect x="4" y="4" width="16" height="16" rx="3" /> }
              }
            </svg>
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
      @if (currentUser.user(); as user) {
        <div class="sidebar__account">
          <div class="sidebar__person">
            <span class="sidebar__avatar" aria-hidden="true">{{ initials(user.name) }}</span>
            <span class="sidebar__person-text"><strong>{{ user.name }}</strong><small>{{ currentUser.roleLabel() }}</small></span>
          </div>
          <button class="sidebar__logout" type="button" (click)="logout()" [disabled]="leaving()">Cerrar sesión</button>
        </div>
      }
    </aside>
  `,
  styles: `
    :host { display: flex; flex: none; width: 260px; }
    .sidebar { display: flex; flex: 1; flex-direction: column; gap: 16px; min-width: 0; min-height: 100dvh; padding: 24px 12px 16px; background: linear-gradient(160deg, var(--primary), var(--accent)); color: var(--surface); }
    .sidebar__top { padding: 0 12px 16px; border-bottom: 1px solid var(--surface); }
    .sidebar__brand { display: flex; align-items: center; gap: 11px; }
    .sidebar__brand svg { flex: none; }
    .sidebar__brand-text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .sidebar__brand-text strong { font-size: 13px; letter-spacing: 0.04em; }
    .sidebar__brand-text span { overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
    .sidebar__nav { display: flex; flex-direction: column; gap: 2px; }
    .sidebar__caption { padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; }
    .sidebar__link { display: flex; align-items: center; gap: 12px; min-height: 40px; padding: 10px 12px; border-left: 3px solid transparent; border-radius: 6px; color: var(--surface); font-size: 13px; text-decoration: none; }
    .sidebar__link:hover, .sidebar__link:focus-visible { background: var(--active-item); color: var(--primary); }
    .sidebar__link--active, .sidebar__link--active:hover { border-left-color: var(--surface); background: var(--active-item); color: var(--primary); font-weight: 650; }
    .sidebar__link--active:hover { border-left-color: var(--primary); }
    .sidebar__icon { flex: none; }
    .sidebar__account { display: flex; flex-direction: column; gap: 12px; margin-top: auto; padding: 12px; border: 1px solid var(--surface); border-radius: 8px; }
    .sidebar__person { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .sidebar__avatar { display: flex; flex: none; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 50%; background: var(--surface); color: var(--primary); font-size: 12px; font-weight: 700; }
    .sidebar__person-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .sidebar__person-text strong, .sidebar__person-text small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sidebar__person-text strong { font-size: 12px; }
    .sidebar__person-text small { font-size: 11px; }
    .sidebar__logout { min-height: 40px; padding: 0 12px; border: 1px solid var(--surface); border-radius: 8px; background: var(--primary); color: var(--surface); font: 600 12px var(--font-family); cursor: pointer; }
    .sidebar__logout:hover { background: var(--active-item); color: var(--primary); }
    .sidebar__toggle { display: none; }
    .sidebar__link:focus-visible, .sidebar__logout:focus-visible, .sidebar__toggle:focus-visible { outline: 2px solid var(--surface); outline-offset: 2px; }
    @media (max-width: 760px) {
      :host { width: 100%; }
      .sidebar { min-height: 0; padding: 12px 16px; }
      .sidebar__top { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 0; border: 0; }
      .sidebar__toggle { display: inline-flex; align-items: center; gap: 7px; min-height: 40px; padding: 0 10px; border: 1px solid var(--surface); border-radius: 8px; background: var(--primary); color: var(--surface); font: 600 12px var(--font-family); cursor: pointer; }
      .sidebar__nav, .sidebar__account { display: none; }
      .sidebar__nav--open { display: flex; }
      .sidebar:has(.sidebar__nav--open) .sidebar__account { display: flex; }
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
  private readonly iconMap: Readonly<Record<string, string>> = {
    dashboard: 'home', inicio: 'home', employees: 'employees', empleados: 'employees',
    notifications: 'notifications', notificaciones: 'notifications',
    calendar: 'calendar', calendario: 'calendar', feriados: 'calendar',
    payroll: 'money', sueldos: 'money', bonos: 'money',
  };

  protected iconFor(item: NavigationItem): string {
    const key = (item.path + ' ' + item.label).toLowerCase();
    return Object.entries(this.iconMap).find(([name]) => key.includes(name))?.[1] ?? 'generic';
  }

  protected initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
  }

  protected logout(): void {
    this.leaving.set(true);
    this.currentUser.logout().subscribe(() => {
      this.leaving.set(false);
      void this.router.navigateByUrl('/login');
    });
  }
}
