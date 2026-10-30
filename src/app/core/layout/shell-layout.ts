import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './app-header';
import { SideNav } from './side-nav';
import './shell-layout.scss';

/**
 * Layout autenticado: encabezado, navegación lateral y outlet de los módulos
 */
@Component({
  selector: 'app-shell-layout',
  standalone: true,
  templateUrl: './shell-layout.html',
  styleUrl: './shell-layout.scss',
  imports: [AppHeader, SideNav, RouterOutlet]
})
export class ShellLayout {
  // Layout solo: el contenido viene de los feature modules por router-outlet
}
