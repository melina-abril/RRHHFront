import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioService } from '../../data-access/inicio.service';
import { InicioSummaryResponse } from '../../models/inicio.models';
import { LoadState } from 'src/app/shared/models/load-state';
import { Router, RouterLink } from '@angular/router';
import { LoadingState } from 'src/app/shared/components/loading-state';
import { ErrorAlert } from 'src/app/shared/components/error-alert';
import { EmptyState } from 'src/app/shared/components/empty-state';

@Component({
  selector: 'app-inicio-page',
  templateUrl: './inicio-page.html',
  styleUrls: ['./inicio-page.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingState, ErrorAlert, EmptyState],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InicioPage {
  private inicioService = inject(InicioService);

  public state = signal<LoadState<InicioSummaryResponse>>({ status: 'loading' });

  constructor() {
    this.loadSummary();
  }

  loadSummary() {
    this.state.set({ status: 'loading' });
    this.inicioService.getHomepageSummary().subscribe({
      next: (data) => {
        if (data) {
          this.state.set({ status: 'ready', data });
        } else {
          this.state.set({ status: 'empty' });
        }
      },
      error: (error) => {
        // Si hay error, muestra mensaje legible
        this.state.set({ status: 'error', message: error?.error?.message || 'No se pudo cargar el resumen.' });
      }
    });
  }

  // Accessors para el template
  public get resumen() {
    const state = this.state();
    return state.status === 'ready' ? state.data : null;
  }
}
