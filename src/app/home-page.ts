import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="home">
      <section class="card" aria-labelledby="home-title">
        <h1 id="home-title">Gestión de RR.HH</h1>
        <p>Bienvenido a la plataforma de Recursos Humanos.</p>
      </section>
    </main>
  `,
  styles: [`
    .home {
      max-width: 48rem;
      margin: var(--space-lg) auto;
    }
    h1 {
      color: var(--text-primary);
      font-size: 1.5rem;
    }
    p {
      color: var(--text-secondary);
    }
  `],
})
export class HomePage {}
