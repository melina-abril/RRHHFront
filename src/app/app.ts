import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './core/layout/app-header';
import { SideNav } from './core/layout/side-nav';
import { CurrentUser } from './core/session/current-user';
import { APP_TITLE } from './app.navigation';

/**
 * Layout común: encabezado, navegación por módulos y contenido; sin sesión solo se ve el login. Los módulos se
 * registran en app.routes.ts y app.navigation.ts.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader, SideNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly currentUser = inject(CurrentUser);

  constructor() {
    inject(Title).setTitle(APP_TITLE);
  }
}
