import { Component } from '@angular/core';
import { APP_TITLE } from './app.navigation';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <main class="home-page">
      <h1>{{ title }}</h1>
      <p>Bienvenido. Las funcionalidades de Recursos Humanos se incorporarán próximamente.</p>
    </main>
  `,
  styles: [`
    .home-page { padding: var(--space-lg); }
    h1 { color: var(--text-primary); font-size: 1.5rem; }
    p { color: var(--text-secondary); }
  `],
})
export class HomePage {
  protected readonly title = APP_TITLE;
}
