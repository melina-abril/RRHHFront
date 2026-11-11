import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { APP_ROLES, APP_TITLE } from '../../app.navigation';
import { CurrentUser } from '../session/current-user';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <div class="site-header__inner">
        <strong class="site-header__title">{{ title }}</strong>
        @if (currentUser.user(); as user) {
          <div class="site-header__user">
            <span>{{ user.name }}</span>
            @if (currentUser.roleLabel(); as roleLabel) {
              <small>{{ roleLabel }}</small>
            }
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
          <button class="button button--secondary site-header__logout" type="button" (click)="logout()" [disabled]="leaving()">
            Cerrar sesión
          </button>
        }
      </div>
    </header>
  `,
  styles: `
    .site-header { background: var(--color-primary); color: var(--color-on-primary); }
    .site-header__inner { max-width: 100rem; margin: auto; padding: var(--space-md) var(--space-lg); display: flex; align-items: center; flex-wrap: wrap; gap: var(--space-md); }
    .site-header__title { font-size: 1.2rem; margin-right: auto; }
    .site-header__user { display: grid; line-height: 1.2; }
    .site-header__user small { opacity: 0.85; }
    .site-header__role { display: grid; gap: 0.2rem; font-size: 0.85rem; }
    .site-header__role select { min-width: 10rem; }
    .site-header__logout { padding: 0.35rem 0.75rem; }
    @media (max-width: 600px) { .site-header__inner { padding: var(--space-md); } .site-header__role { width: 100%; } }
  `,
})
export class AppHeader {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly title = APP_TITLE;
  protected readonly roles = APP_ROLES;
  /** "Ver como" solo en modo mock: con backend el rol es el del usuario y no se cambia desde acá. */
  protected readonly canSwitchRole = environment.useMock && APP_ROLES.length > 1;
  protected readonly leaving = signal(false);
  private readonly router = inject(Router);

  protected changeRole(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    this.currentUser.setRole(target.value);
    // La pantalla actual puede no estar permitida para el rol nuevo.
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
