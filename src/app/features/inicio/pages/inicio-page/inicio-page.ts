import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { InicioService } from '../../data-access/inicio.service';
import { CommonModule } from '@angular/common';
import { ResumenDashboard } from '../../models/inicio.models';
// Cambiar imports de componentes compartidos a rutas reales
import { LoadingState } from '../../../../shared/components/loading-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { AsyncPipe } from '@angular/common';
import { Signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-inicio-page',
  templateUrl: './inicio-page.html',
  styleUrls: ['./inicio-page.scss'],
  imports: [CommonModule, LoadingState, ErrorAlert],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InicioPage {
  private readonly inicioService = inject(InicioService);
  public readonly resumenState = signal<{ status: 'loading' | 'ready' | 'error'; data?: ResumenDashboard; message?: string }>({ status: 'loading' });

  public readonly resumen = computed(() => {
    const s = this.resumenState();
    return s.status === 'ready' && s.data ? s.data : undefined;
  });
  public readonly state = computed(() => this.resumenState());

  constructor() {
    this.cargarResumen();
  }

  cargarResumen() {
    this.resumenState.set({ status: 'loading' });
    this.inicioService.getDashboardSummary().subscribe({
      next: (data) => this.resumenState.set({ status: 'ready', data }),
      error: (err) => {
        this.resumenState.set({ status: 'error', message: 'No se pudo cargar el resumen general de inicio.' });
      }
    });
  }
}
