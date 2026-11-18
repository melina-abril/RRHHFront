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
    <aside class="navigation-container" aria-label="Menú del sistema">
      <button class="navigation-toggle" type="button" [attr.aria-expanded]="open()" aria-controls="module-navigation" (click)="open.set(!open())">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        Menú
      </button>
      <div class="navigation-panel" [class.navigation-panel--open]="open()">
        <div class="navigation-brand">
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect width="32" height="32" rx="8" fill="currentColor" fill-opacity=".18"/><path d="M7 10h18M16 10v14M9 17h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="23" cy="23" r="3" fill="currentColor"/></svg>
          <span><strong>TECHFORB</strong><small>{{ title }}</small></span>
        </div>
        <nav id="module-navigation" class="navigation" aria-label="Navegación principal">
          <span class="navigation__heading">NAVEGACIÓN</span>
          @for (item of items(); track item.path) {
            <a class="navigation__link" [class.navigation__link--child]="isChild(item)" [routerLink]="'/' + item.path" routerLinkActive="navigation__link--active" ariaCurrentWhenActive="page" (click)="open.set(false)">
              @if (isHome(item)) {
                <span class="navigation__home-icon" aria-hidden="true"></span>
              } @else if (isChild(item)) {
                <span class="navigation__child-icon" aria-hidden="true"></span>
              } @else {
                <span class="navigation__section-icon" aria-hidden="true"></span>
              }
              {{ item.label }}
            </a>
          }
        </nav>
        @if (currentUser.user(); as user) {
          <div class="navigation-account">
            <div class="navigation-account__identity">
              <span class="navigation-account__avatar" aria-hidden="true">{{ initials(user.name) }}</span>
              <span><strong>{{ user.name }}</strong><small>{{ currentUser.roleLabel() }}</small></span>
            </div>
            <button class="navigation-account__logout" type="button" (click)="logout()" [disabled]="leaving()">Cerrar sesión</button>
          </div>
        }
      </div>
    </aside>
  `,
  styles: `
    :host { display: block; min-width: 0; }
    .navigation-container { position: sticky; top: 0; width: 260px; height: 100dvh; color: var(--surface, var(--color-surface)); background: radial-gradient(circle at 100% 13%, color-mix(in srgb, var(--surface, var(--color-surface)) 12%, transparent), transparent 32%), radial-gradient(circle at 0% 69%, color-mix(in srgb, var(--accent, var(--color-primary)) 23%, transparent), transparent 38%), linear-gradient(160deg, var(--primary, var(--color-primary)), var(--accent, var(--color-primary))); }
    .navigation-panel { height: 100%; padding: 24px 12px 16px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; }
    .navigation-brand { padding: 0 12px 16px; display: flex; align-items: center; gap: 11px; border-bottom: 1px solid color-mix(in srgb, var(--surface, var(--color-surface)) 18%, transparent); }
    .navigation-brand svg { flex: none; }
    .navigation-brand > span { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .navigation-brand strong { font-size: 13px; letter-spacing: .04em; }
    .navigation-brand small { font-size: 12px; color: color-mix(in srgb, var(--surface, var(--color-surface)) 78%, transparent); }
    .navigation { display: flex; flex-direction: column; gap: 2px; }
    .navigation__heading { padding: 8px 12px; font-size: 11px; font-weight: 700; letter-spacing: .08em; color: color-mix(in srgb, var(--surface, var(--color-surface)) 70%, transparent); }
    .navigation__link { min-height: 40px; padding: 10px 12px; display: flex; align-items: center; gap: 12px; border-left: 3px solid transparent; border-radius: 6px; color: color-mix(in srgb, var(--surface, var(--color-surface)) 75%, transparent); text-decoration: none; font-size: 13px; line-height: 1.35; }
    .navigation__link:hover, .navigation__link:focus-visible { background: color-mix(in srgb, var(--surface, var(--color-surface)) 10%, transparent); color: var(--surface, var(--color-surface)); }
    .navigation__link--active, .navigation__link--active:hover { border-left-color: var(--surface, var(--color-surface)); background: color-mix(in srgb, var(--surface, var(--color-surface)) 15%, transparent); color: var(--surface, var(--color-surface)); font-weight: 650; }
    .navigation__link--child { min-height: 32px; padding: 7px 12px 7px 35px; font-size: 12px; }
    .navigation__home-icon { width: 7px; height: 7px; flex: none; border-radius: 50%; background: currentColor; }
    .navigation__section-icon { width: 7px; height: 7px; flex: none; border: 1.5px solid currentColor; border-radius: 2px; }
    .navigation__child-icon { width: 5px; height: 5px; flex: none; border-radius: 50%; background: currentColor; }
    .navigation-account { margin-top: auto; padding: 12px; display: flex; flex-direction: column; gap: 12px; border: 1px solid color-mix(in srgb, var(--surface, var(--color-surface)) 18%, transparent); border-radius: 12px; background: color-mix(in srgb, var(--surface, var(--color-surface)) 9%, transparent); }
    .navigation-account__identity { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .navigation-account__avatar { width: 36px; height: 36px; display: inline-flex; align-items: center; justify-content: center; flex: none; border-radius: 50%; background: var(--surface, var(--color-surface)); color: var(--primary, var(--color-primary)); font-size: 12px; font-weight: 700; }
    .navigation-account__identity > span:last-child { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
    .navigation-account__identity strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
    .navigation-account__identity small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; color: color-mix(in srgb, var(--surface, var(--color-surface)) 78%, transparent); }
    .navigation-account__logout { min-height: 40px; padding: 0 12px; border: 1px solid color-mix(in srgb, var(--surface, var(--color-surface)) 32%, transparent); border-radius: 8px; background: var(--primary, var(--color-primary)); color: var(--surface, var(--color-surface)); font: 600 12px var(--font-family); cursor: pointer; }
    .navigation-account__logout:hover { background: color-mix(in srgb, var(--surface, var(--color-surface)) 12%, var(--primary, var(--color-primary))); }
    .navigation-account__logout:disabled { opacity: .6; cursor: wait; }
    .navigation-toggle { display: none; }
    .navigation-container :is(a, button):focus-visible { outline: 2px solid var(--surface, var(--color-surface)); outline-offset: 2px; }
    @media (max-width: 760px) { :host { position: absolute; top: 0; left: 0; z-index: 10; } .navigation-container { position: static; width: 0; height: 0; background: transparent; } .navigation-toggle { position: absolute; top: 12px; left: 12px; z-index: 2; min-height: 40px; padding: 0 10px; display: inline-flex; align-items: center; gap: 7px; border: 1px solid var(--border, var(--color-border)); border-radius: 8px; background: var(--surface, var(--color-surface)); color: var(--primary, var(--color-primary)); font: 600 12px var(--font-family); cursor: pointer; } .navigation-panel { display: none; position: absolute; top: 64px; left: 0; width: min(260px, 100vw); height: calc(100dvh - 64px); background: linear-gradient(160deg, var(--primary, var(--color-primary)), var(--accent, var(--color-primary))); } .navigation-panel--open { display: flex; } .navigation-toggle:focus-visible { outline-color: var(--accent, var(--color-primary)); } }
  `,
})
export class SideNav {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly title = APP_TITLE;
  protected readonly open = signal(false);
  protected readonly leaving = signal(false);
  protected readonly items = computed(() => APP_NAVIGATION.filter((item) => this.currentUser.hasRole(item.roles)));
  private readonly router = inject(Router);

  protected isHome(item: NavigationItem): boolean {
    return /^(inicio|home)$/i.test(item.label);
  }

  protected isChild(item: NavigationItem): boolean {
    return /^(bonos|usuarios|roles y permisos)$/i.test(item.label);
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
