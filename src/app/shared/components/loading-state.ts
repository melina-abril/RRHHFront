import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="loading-state" aria-busy="true" aria-live="polite">
      <span class="loading-state__spinner" aria-hidden="true"></span>
      <span class="loading-state__text">Cargando...</span>
    </div>
  `,
  styles: [
    `
    .loading-state {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 32px 0;
      color: var(--text-secondary);
      font-size: 15px;
      gap: 12px;
    }

    .loading-state__spinner {
      width: 24px;
      height: 24px;
      border: 3px solid var(--active-item);
      border-top: 3px solid var(--brand-main);
      border-radius: 50%;
      display: inline-block;
      animation: loading-rot 0.85s linear infinite;
    }

    @keyframes loading-rot {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    `
  ]
})
export class LoadingState {}
