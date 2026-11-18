import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { APP_NAVIGATION as SYSTEM_NAVIGATION, APP_TITLE } from '../../app.navigation';
import { CurrentUser } from '../session/current-user';
import { mobileMenuOpen } from './app-header';
import { NavigationItem } from './navigation.model';

const APP_NAVIGATION: readonly NavigationItem[] = SYSTEM_NAVIGATION;

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="sidebar">
      <div class="sidebar__brand">
        <svg class="sidebar__logo" width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect width="32" height="32" rx="8" fill="currentColor" fill-opacity=".18"/><path d="M7 10h18M16 10v14M9 17h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="23" cy="23" r="3" fill="currentColor"/></svg>
        <span><strong>TECHFORB</strong><small>{{ title }}</small></span>
      </div>
      <nav id="module-navigation" class="sidebar__navigation" aria-label="Navegación principal" [class.sidebar__navigation--open]="open()">
        <span class="sidebar__heading">NAVEGACIÓN</span>
        @for (item of items(); track item.path) {
          <a class="sidebar__link" [routerLink]="'/' + item.path" routerLinkActive="sidebar__link--active" ariaCurrentWhenActive="page" [routerLinkActiveOptions]="{ exact: false }" (click)="open.set(false)">
            @switch (iconFor(item)) {
              @case ('home') { <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m3 11 9-8 9 8v10h-7v-7h-4v7H3z"/></svg> }
              @case ('people') { <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M2 20v-2a7 7 0 0 1 14 0v2zM17 5a3 3 0 0 1 0 6m1 4a5 5 0 0 1 4 5"/></svg> }
              @case ('calendar') { <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/></svg> }
              @case ('bell') { <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></svg> }
              @case ('money') { <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M12 8v8m-3-2a4 4 0 0 0 6 0m-6-4a4 4 0 0 1 6 0"/></svg> }
              @default { <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg> }
            }
            <span>{{ item.label }}</span>
          </a>
        }
      </nav>
      @if (currentUser.user(); as user) {
        <div class="sidebar__account">
          <div class="sidebar__person"><span class="sidebar__avatar" aria-hidden="true">{{ initials(user.name) }}</span><span><strong>{{ user.name }}</strong><small>{{ currentUser.roleLabel() }}</small></span></div>
          <button class="sidebar__logout" type="button" (click)="logout()" [disabled]="leaving()">Cerrar sesión</button>
        </div>
      }
    </aside>
  `,
  styles: `
    :host { display: block; height: 100%; }
    .sidebar { box-sizing: border-box; display: flex; flex-direction: column; gap: 16px; width: 100%; min-height: 100%; padding: 24px 12px 16px; background: var(--primary, var(--color-primary)); color: var(--surface, var(--color-on-primary)); font-family: var(--font-family, Inter, sans-serif); }
    .sidebar__brand { display: flex; align-items: center; gap: 11px; padding: 0 12px 16px; border-bottom: 1px solid var(--accent, var(--color-primary)); }
    .sidebar__logo { flex: none; }
    .sidebar__brand span, .sidebar__person span:last-child { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .sidebar__brand strong { font-size: 13px; letter-spacing: .04em; }
    .sidebar__brand small { font-size: 12px; opacity: .8; }
    .sidebar__navigation { display: flex; flex-direction: column; gap: 2px; }
    .sidebar__heading { padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: .08em; opacity: .75; }
    .sidebar__link { display: flex; align-items: center; gap: 12px; min-height: 40px; padding: 8px 12px; box-sizing: border-box; border-left: 3px solid transparent; border-radius: 6px; color: inherit; opacity: .78; text-decoration: none; font-size: 13px; line-height: 1.35; }
    .sidebar__link svg { flex: none; }
    .sidebar__link:hover, .sidebar__link:focus-visible { background: var(--accent, var(--color-primary)); opacity: 1; }
    .sidebar__link--active, .sidebar__link--active:hover { border-left-color: var(--surface, var(--color-on-primary)); background: var(--accent, var(--color-primary)); opacity: 1; font-weight: 650; }
    .sidebar__account { display: flex; flex-direction: column; gap: 12px; margin-top: auto; padding: 12px; border: 1px solid var(--accent, var(--color-primary)); border-radius: 8px; }
    .sidebar__person { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .sidebar__avatar { display: grid; place-items: center; width: 36px; height: 36px; flex: none; border-radius: 50%; background: var(--surface, var(--color-surface)); color: var(--primary, var(--color-primary)); font-size: 12px; font-weight: 700; }
    .sidebar__person strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
    .sidebar__person small { font-size: 11px; opacity: .8; }
    .sidebar__logout { min-height: 40px; padding: 0 12px; border: 1px solid var(--accent, var(--color-primary)); border-radius: 8px; background: transparent; color: inherit; font: 600 12px var(--font-family, Inter, sans-serif); cursor: pointer; }
    .sidebar__logout:hover { background: var(--accent, var(--color-primary)); }
    :is(a, button):focus-visible { outline: 2px solid var(--surface, var(--color-on-primary)); outline-offset: 2px; }
    @media (max-width: 760px) { :host { height: auto; } .sidebar { min-height: 0; padding: 0 16px; } .sidebar__brand, .sidebar__account { display: none; } .sidebar__navigation { display: none; padding: 12px 0; } .sidebar__navigation--open { display: flex; } }
  `,
})
export class SideNav {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly title = APP_TITLE;
  protected readonly open = mobileMenuOpen;
  protected readonly leaving = signal(false);
  protected readonly items = computed(() => APP_NAVIGATION.filter((item) => this.currentUser.hasRole(item.roles)));
  private readonly router = inject(Router);

  protected iconFor(item: NavigationItem): 'home' | 'people' | 'calendar' | 'bell' | 'money' | 'generic' {
    const label = item.label.toLowerCase();
    if (/inicio|principal/.test(label)) return 'home';
    if (/emplead|colaborador|usuario|cliente/.test(label)) return 'people';
    if (/calendario|feriado|ausencia|hora/.test(label)) return 'calendar';
    if (/notific|comunicado/.test(label)) return 'bell';
    if (/sueldo|bono|pago|remuneraci/.test(label)) return 'money';
    return 'generic';
  }

  protected initials(name: string): string {
    return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
  }

  protected logout(): void {
    this.leaving.set(true);
    this.currentUser.logout().subscribe(() => {
      this.leaving.set(false);
      this.open.set(false);
      void this.router.navigateByUrl('/login');
    });
  }
}
