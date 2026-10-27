import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <div class="empty-state__icon">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true"><circle cx="26" cy="26" r="26" fill="var(--soft-background)"/></svg>
      </div>
      <div class="empty-state__content">
        <h3 *ngIf="title" class="empty-state__title">{{title}}</h3>
        <p class="empty-state__desc">{{message}}</p>
      </div>
    </div>
  `,
  styles: [
    `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 220px;
      background: var(--surface);
      border: 1px dashed var(--border);
      border-radius: var(--radius-md);
      padding: 32px 24px;
      color: var(--text-secondary);
      text-align: center;
    }
    .empty-state__icon { margin-bottom: 12px; }
    .empty-state__title { margin-bottom: 6px; font-size: 18px; font-weight: 650; color: var(--text-primary); }
    .empty-state__desc { font-size: 14px; color: var(--text-secondary); }
    `
  ]
})
export class EmptyState {
  @Input() title?: string;
  @Input({ required: true }) message!: string;
}
