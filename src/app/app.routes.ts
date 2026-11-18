import { Component } from '@angular/core';
import type { Routes } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  template: `
    <main class="welcome">
      <h1>Gestión de RR.HH</h1>
      <p>Bienvenido. Las funcionalidades estarán disponibles aquí cuando se incorporen al sistema.</p>
    </main>
  `,
  styles: [`
    .welcome {
      padding: var(--space-xl);
      color: var(--text-primary);
    }
    .welcome h1 {
      margin: 0 0 var(--space-sm);
      font-size: 1.5rem;
    }
    .welcome p {
      margin: 0;
      color: var(--text-secondary);
    }
  `]
})
class WelcomePage {}

export const routes: Routes = [
  { path: '', component: WelcomePage, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
