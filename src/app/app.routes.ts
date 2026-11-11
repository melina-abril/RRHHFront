import { Component } from '@angular/core';
import type { Routes } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <main class="home-page">
      <section class="home-page__card" aria-labelledby="home-title">
        <h1 id="home-title">Gestión de RR.HH</h1>
        <p>Bienvenido a la plataforma de Recursos Humanos. Las funcionalidades estarán disponibles aquí cuando se incorporen sus módulos.</p>
      </section>
    </main>
  `,
  styles: [`
    .home-page { max-width: 56rem; margin: 0 auto; padding: var(--space-lg); }
    .home-page__card { padding: var(--space-lg); background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); }
    h1 { margin: 0 0 var(--space-sm); color: var(--text-primary); font-size: 1.5rem; }
    p { margin: 0; color: var(--text-secondary); line-height: 1.5; }
  `]
})
export class HomePage {}

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
