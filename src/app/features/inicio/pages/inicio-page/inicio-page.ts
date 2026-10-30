import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioService } from '../../data-access/inicio.service';
import { InicioResumen } from '../../models/inicio.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss',
  imports: [CommonModule, RouterLink]
})
export class InicioPage {
  private readonly servicio = inject(InicioService);
  readonly cargando = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly resumen = signal<InicioResumen | null>(null);

  constructor() {
    effect(() => {
      this.cargarResumen();
    });
  }
  cargarResumen() {
    this.cargando.set(true);
    this.error.set(null);
    this.servicio.getResumen().subscribe({
      next: resumen => {
        this.resumen.set(resumen);
        this.cargando.set(false);
      },
      error: err => {
        this.resumen.set(null);
        this.error.set(typeof err === 'string' ? err : 'No se pudo cargar el resumen general.');
        this.cargando.set(false);
      }
    });
  }
}
