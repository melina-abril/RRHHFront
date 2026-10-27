import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <header class="page-header">
      <div class="page-header__main">
        <h1 class="page-header__title">{{ title }}</h1>
        <ng-container *ngIf="subtitle">
          <div class="page-header__subtitle">{{ subtitle }}</div>
        </ng-container>
      </div>
      <div class="page-header__actions">
        <ng-container *ngIf="actionsRef">
          <ng-container *ngTemplateOutlet="actionsRef"></ng-container>
        </ng-container>
      </div>
    </header>
  `,
  styles: [
    `
    .page-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      background: none;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
      gap: 13px 32px;
    }
    .page-header__main {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .page-header__title {
      font-size: 26px;
      font-weight: 650;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.02em;
    }
    .page-header__subtitle {
      font-size: 15px;
      color: var(--text-secondary);
      margin-top: 2px;
    }
    .page-header__actions {
      flex-shrink: 0;
      align-self: flex-end;
      min-height: 30px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    `
  ]
})
export class PageHeader {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;

  @ContentChild('actions', { static: false, read: TemplateRef }) actionsRef?: TemplateRef<unknown>;
}
