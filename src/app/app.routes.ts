import { Component } from '@angular/core';
import type { Routes } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <main class="card">
      <h1>Gestión de RR.HH</h1>
      <p>Bienvenido. Las funcionalidades estarán disponibles a medida que se incorporen los módulos.</p>
    </main>
  `
})
export class HomePage {}

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];
