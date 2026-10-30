import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InicioService } from '../../data-access/inicio.service';
import { LoadState } from '../../../../shared/models/load-state';
import { InicioResumen } from '../../data-access/inicio.models';
import { signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-inicio-page',
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss',
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InicioPage {
  private readonly inicioService = inject(InicioService);

  public readonly resumenState = signal<LoadState<InicioResumen>>({ status: 'loading' });

  constructor() {
    this.inicioService.getResumen().subscribe({
      next: data => {
        this.resumenState.set({ status: 'ready', data });
      },
      error: () => {
        this.resumenState.set({ status: 'error', error: 'No se pudo cargar el resumen.' });
      }
    });
  }
}
