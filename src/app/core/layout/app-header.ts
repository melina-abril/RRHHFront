import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { APP_ROLES as SYSTEM_ROLES, APP_TITLE } from '../../app.navigation';
import { CurrentUser } from '../session/current-user';
import { AppRole } from './navigation.model';

const APP_ROLES: readonly AppRole[] = SYSTEM_ROLES;

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header">
      <div class="site-header__heading">
        <span class="site-header__breadcrumb">{{ title }}</span>
        <strong class="site-header__title">{{ title }}</strong>
      </div>
      @if (currentUser.user(); as user) {
        <div class="site-header__actions">
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
          <span class="site-header__user">
            <span class="site-header__avatar" aria-hidden="true">{{ user.name.slice(0, 1).toUpperCase() }}</span>
            <span class="site-header__user-details">
              <strong>{{ user.name }}</strong>
              @if (currentUser.roleLabel(); as roleLabel) {
                <small>{{ roleLabel }}</small>
              }
            </span>
          </span>
        </div>
      }
    </header>
  `,
  styles: `
    .site-header {
      min-height: 64px;
      padding: 10px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }
    .site-header__heading {
      min-width: 0;
      display: grid;
      gap: 1px;
    }
    .site-header__breadcrumb {
      color: var(--text-secondary);
      font-size: 11px;
    }
    .site-header__title {
      color: var(--text-primary);
      font-size: 17px;
      font-weight: 650;
    }
    .site-header__actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .site-header__role {
      display: grid;
      gap: 3px;
      color: var(--text-secondary);
      font-size: 11px;
    }
    .site-header__role select {
      min-width: 120px;
      padding: 7px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--text-primary);
      font: inherit;
    }
    .site-header__user {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .site-header__avatar {
      width: 36px;
      height: 36px;
      flex: none;
      display: grid;
      place-items: center;
      border-radius: 50%;
      background: var(--soft-background);
      color: var(--primary);
      font-size: 12px;
      font-weight: 700;
    }
    .site-header__user-details {
      display: grid;
      gap: 2px;
      font-size: 12px;
    }
    .site-header__user-details small {
      color: var(--text-secondary);
      font-size: 11px;
    }
    .site-header__role select:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    @media (max-width: 760px) {
      .site-header {
        padding: 10px 16px;
      }
    }
    @media (max-width: 480px) {
      .site-header__user-details {
        display: none;
      }
    }
  `,
})
export class AppHeader {
  protected readonly currentUser = inject(CurrentUser);
  protected readonly title = APP_TITLE;
  protected readonly roles = APP_ROLES;
  protected readonly canSwitchRole = environment.useMock && APP_ROLES.length > 1;
  private readonly router = inject(Router);

  protected changeRole(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    this.currentUser.setRole(target.value);
    void this.router.navigateByUrl('/');
  }
}
