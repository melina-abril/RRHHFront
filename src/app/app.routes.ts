import { Component } from '@angular/core';
import type { Routes } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  template: `
    <main class="card" aria-labelledby="welcome-title">
      <h1 id="welcome-title">Gestión de RR.HH</h1>
      <p>Bienvenido. Las funcionalidades de Recursos Humanos estarán disponibles aquí cuando se incorporen sus módulos.</p>
    </main>
  `
})
export class WelcomePage {}

export const routes: Routes = [
  { path: '', component: WelcomePage, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
