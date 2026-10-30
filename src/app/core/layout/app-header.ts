import { Component, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

/**
 * Encabezado: logo, nombre sistema, usuario actual y botón cerrar sesión
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <span class="logo" aria-label="TECHFORB RH">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="18" fill="var(--brand-accent)" />
            <path d="M10 25h16v-2.8c-3.2-1.13-5.33-4.2-5.33-7.43V9h-2.75v5.77c0 2.63-1.8 6.7-7.92 7.43V25z" fill="var(--brand-main)" />
          </svg>
        </span>
        <span class="app-title">Gestión de RR.HH</span>
      </div>
      <div class="header-right">
        <span class="user" *ngIf="auth.session() as sesion">
          <span class="avatar" aria-label="Administrador">{{ initials(sesion.nombre) }}</span>
          <span class="user-info">
            <span class="user-name">{{ sesion.nombre }}</span>
            <span class="user-email">{{ sesion.email }}</span>
          </span>
        </span>
        <button class="btn-primary btn-logout" type="button" (click)="logout()">Cerrar sesión</button>
      </div>
    </header>
  `,
  styleUrl: './app-header.scss'
})
export class AppHeader {
  auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }

  /** Iniciales del usuario para el avatar, ej. JM */
  initials(nombre: string): string {
    if (!nombre) return '';
    return nombre
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
