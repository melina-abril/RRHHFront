import { Component, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioService } from '../../data-access/inicio.service';
import { InicioSummaryResponse } from '../../models/inicio.models';
import { LoadState } from 'src/app/shared/models/load-state';
import { RouterModule, RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  templateUrl: './inicio-page.html',
  styleUrls: ['./inicio-page.scss'],
  imports: [RouterLink, CommonModule, RouterModule, DecimalPipe, DatePipe]
})
export class InicioPage {
  public readonly summaryState = signal<LoadState<InicioSummaryResponse>>({ status: 'loading' });

  constructor(private inicioSrv: InicioService) {
    this.loadSummary();
  }

  public loadSummary(): void {
    this.summaryState.set({ status: 'loading' });
    this.inicioSrv.getHomepageSummary().subscribe({
      next: (data) => {
        if (data) {
          this.summaryState.set({ status: 'ready', data });
        } else {
          this.summaryState.set({ status: 'empty' });
        }
      },
      error: (err) => {
        this.summaryState.set({ status: 'error', message: err?.message || 'No se pudo cargar el resumen.' });
      }
    });
  }
}
