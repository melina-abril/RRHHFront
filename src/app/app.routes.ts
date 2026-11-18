import { Component } from '@angular/core';
import type { Routes } from '@angular/router';

@Component({
  selector: 'app-start-page',
  standalone: true,
  template: `<main class="start-page"><h1>Gestión de RR.HH</h1><p>Bienvenido a RH smart.</p></main>`,
  styles: [`.start-page { padding: var(--space-xl); color: var(--text-primary); }`]
})
class StartPage {}

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: StartPage },
  { path: '**', redirectTo: '' }
];
