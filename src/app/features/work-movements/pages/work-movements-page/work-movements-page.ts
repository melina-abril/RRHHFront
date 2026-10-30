import { Component, computed, effect, signal, inject } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { WorkMovementsService } from '../../data-access/work-movements.service';
import { WorkMovement, ChangeCategoryRequest, EgressRequest, ReentryRequest } from '../../models/work-movements.models';
import { WorkMovementHistoryTable } from '../../components/work-movement-history-table';
import { LoadingState } from 'src/app/shared/components/loading-state';
import { EmptyState } from 'src/app/shared/components/empty-state';
import { ErrorAlert } from 'src/app/shared/components/error-alert';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'work-movements-page',
  standalone: true,
  imports: [NgIf, NgFor, WorkMovementHistoryTable, LoadingState, EmptyState, ErrorAlert, ReactiveFormsModule],
  templateUrl: './work-movements-page.html',
  styleUrl: './work-movements-page.scss'
})
export class WorkMovementsPage {
  private workMovementsService = inject(WorkMovementsService);
  private router = inject(Router);
  readonly legajo = signal('TFB-0042'); // Ejemplo realista mock. Reemplazar por obtención real/router param.

  readonly collaboratorName = signal('Martina Costa');
  readonly collaboratorRole = signal('Analista de calidad');
  readonly collaboratorStatus = signal('Activo');
  readonly collaboratorCategory = signal('Permanente');
  readonly entryDate = signal('2025-02-10');
  readonly firstEntryDate = signal('2020-03-02');
  readonly activeAssignments = signal(1);

  readonly selectedAction = signal<'change-category' | 'egress' | 'reentry'>('egress');

  readonly historyState = signal<{ status: 'loading' | 'ready' | 'error'; data?: WorkMovement[]; message?: string }>({ status: 'loading' });

  constructor() {
    this.loadHistory();
  }

  loadHistory(): void {
    this.historyState.set({ status: 'loading' });
    this.workMovementsService.getWorkMovementsHistory(this.legajo())
      .subscribe({
        next: data => {
          this.historyState.set({ status: 'ready', data });
        },
        error: err => {
          this.historyState.set({ status: 'error', message: 'No se pudo cargar el historial de movimientos.' });
        }
      });
  }

  goBack() {
    this.router.navigate(['/colaboradores', this.legajo()]);
  }

  isChangingCategory() {
    return this.selectedAction() === 'change-category';
  }

  isRegisterEgress() {
    return this.selectedAction() === 'egress';
  }

  isRegisterReentry() {
    return this.selectedAction() === 'reentry';
  }
}
