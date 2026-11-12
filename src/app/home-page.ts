import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <main class="home-page">
      <h1>Gestión de RR.HH</h1>
      <p>Bienvenido. Las funcionalidades estarán disponibles aquí cuando se incorporen los módulos.</p>
    </main>
  `,
  styles: [`
    .home-page {
      padding: var(--space-lg);
      color: var(--color-text);
    }

    .home-page h1 {
      margin: 0 0 var(--space-sm);
      font-size: 1.5rem;
    }

    .home-page p {
      margin: 0;
      color: var(--color-text-muted);
    }
  `],
})
export class HomePage {}
