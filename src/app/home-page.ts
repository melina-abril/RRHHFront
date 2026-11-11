import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <main class="card" aria-labelledby="home-title">
      <h1 id="home-title">Gestión de RR.HH</h1>
      <p>Bienvenido. Las funcionalidades de Recursos Humanos estarán disponibles aquí cuando se incorporen sus módulos.</p>
    </main>
  `,
  styles: [`
    :host {
      display: block;
    }
    h1 {
      color: var(--text-primary);
      font-size: 1.375rem;
      margin: 0 0 var(--space-sm);
    }
    p {
      color: var(--text-secondary);
      margin: 0;
    }
  `]
})
export class HomePage {}
