import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Navegación lateral: un link por cada módulo del plan (colaboradores, inicio, etc.)
 */
@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="side-nav" role="navigation">
      <ul>
        <li>
          <a routerLink="/inicio" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            <span class="icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2 2 7v2c0 .55.45 1 1 1h1v9c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-4h2v4c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-9h1c.55 0 1-.45 1-1V7l-10-5z" fill="var(--brand-accent)"/></svg>
            </span>
            Inicio
          </a>
        </li>
        <li>
          <a routerLink="/colaboradores" routerLinkActive="active">
            <span class="icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5.997 1.31 6 3.94V18H6v-2.06C6 13.3 9.3 12 12 12zm0-2A3 3 0 1 0 12 4a3 3 0 0 0 0 6z" fill="var(--brand-accent)"/></svg>
            </span>
            Colaboradores
          </a>
        </li>
        <!--
        <li>
          <a routerLink="/sueldos-bonos" routerLinkActive="active">Sueldos y Bonos</a>
        </li>
        <li>
          <a routerLink="/solicitudes" routerLinkActive="active">Solicitudes</a>
        </li>
        <li>
          <a routerLink="/comunicados" routerLinkActive="active">Comunicados</a>
        </li>
        <li>
          <a routerLink="/horas-extras" routerLinkActive="active">Horas Extras</a>
        </li>
        -->
      </ul>
    </nav>
  `,
  styleUrl: './side-nav.scss'
})
export class SideNav {}
