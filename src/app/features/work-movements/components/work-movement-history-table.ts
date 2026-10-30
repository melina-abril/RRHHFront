import { Component, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { WorkMovement, WorkMovementType } from '../models/work-movements.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'work-movement-history-table',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  template: `
    <div class="wm-history-table-scroll">
      <table class="wm-history-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Movimiento</th>
            <th>Detalle</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          @for (mov of movements; track mov.createdAt) {
            <tr class="wm-row">
              <td>{{ mov.date | date:'dd/MM/yyyy' }}</td>
              <td>
                <span [ngClass]="movementTypeBadgeClass(mov.type)">
                  {{ movementTypeLabel(mov.type) }}
                </span>
              </td>
              <td>
                {{ detailText(mov) }}
                <br />
                <span class="wm-detail-extra" *ngIf="extraText(mov)">{{ extraText(mov) }}</span>
              </td>
              <td>
                {{ mov.reason }}<br />
                <span class="wm-meta">
                  Registró {{ mov.performedBy }} · {{ mov.date | date:'dd/MM/yyyy' }}
                </span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
      .wm-history-table-scroll { width: 100%; overflow-x: auto; border-radius: 16px; }
      .wm-history-table { width: 100%; min-width: 880px; border-collapse: collapse; text-align: left; }
      th { background: var(--soft-background); color: var(--text-secondary); font-size: 12px; font-weight: 600; padding: 13px 16px; border-bottom: 1px solid var(--border); }
      td { padding: 13px 16px; border-bottom: 1px solid var(--border); vertical-align: top; font-size: 14px; }
      .wm-row { }
      .wm-detail-extra { color: var(--text-secondary); font-size: 12px; }
      .wm-meta { color: var(--text-secondary); font-size: 12px; }
      .wm-badge {
        display: inline-flex; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 600;
      }
      .wm-badge-green { background: #E6F5EC; color: #207349; }
      .wm-badge-purple { background: var(--soft-background); color: var(--brand-main); }
      .wm-badge-pink { background: #FCE8EC; color: #B32F48; }
      .wm-badge-dark { background: #EDE4F6; color: var(--brand-main); }
    `
  ]
})
export class WorkMovementHistoryTable {
  @Input({ required: true }) movements!: WorkMovement[];

  movementTypeLabel(type: WorkMovementType): string {
    switch(type) {
      case 'CHANGE_CATEGORY': return 'Cambio de categoría';
      case 'EGRESS': return 'Egreso';
      case 'REENTRY': return 'Reingreso';
      case 'ENTRY': return 'Ingreso inicial';
      default: return type;
    }
  }

  movementTypeBadgeClass(type: WorkMovementType): string {
    switch (type) {
      case 'CHANGE_CATEGORY': return 'wm-badge wm-badge-dark';
      case 'EGRESS': return 'wm-badge wm-badge-pink';
      case 'REENTRY': return 'wm-badge wm-badge-green';
      case 'ENTRY': return 'wm-badge wm-badge-purple';
      default: return 'wm-badge';
    }
  }

  detailText(mov: WorkMovement): string {
    if (mov.type === 'CHANGE_CATEGORY') {
      return `${mov.previousCategory || ''} → ${mov.newCategory || ''}`;
    }
    if (mov.type === 'EGRESS' || mov.type === 'REENTRY') {
      return `${mov.previousStatus || ''} → ${mov.newStatus || ''}${mov.newCategory ? ' · ' + mov.newCategory : ''}`;
    }
    if (mov.type === 'ENTRY') {
      return 'Sin período anterior → Activo' + (mov.newCategory ? ` · ${mov.newCategory}` : '');
    }
    return '-';
  }

  extraText(mov: WorkMovement): string | null {
    if (mov.type === 'REENTRY') {
      return 'Nuevo período · Analista de calidad';
    }
    if (mov.type === 'EGRESS') {
      return mov.date === '2022-06-30' ? 'Cierre del período iniciado el 02/03/2020' : 'Cierre del período iniciado el 07/08/2023';
    }
    if (mov.type === 'CHANGE_CATEGORY') {
      return 'Ingreso original conservado';
    }
    if (mov.type === 'ENTRY') {
      return 'Alta del legajo ' + mov.legajo;
    }
    return null;
  }
}
