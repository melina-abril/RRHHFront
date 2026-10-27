import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  template: `
    <div class="error-alert" role="alert">
      <svg class="error-alert__icon" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="var(--error)" fill-opacity="0.08"/>
        <path d="M12 7.25a1 1 0 0 1 1 1V13a1 1 0 0 1-2 0V8.25a1 1 0 0 1 1-1zm0 9a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5z" fill="var(--error)"/>
      </svg>
      <span class="error-alert__msg">{{message}}</span>
    </div>
  `,
  styles: [
    `
    .error-alert {
      display: flex;
      align-items: center;
      background: #FCE8EC;
      border: 1.5px solid var(--error);
      border-radius: var(--radius-md);
      padding: 10px 18px;
      color: var(--error);
      font-weight: 600;
      font-size: 14px;
      gap: 10px;
    }
    .error-alert__icon {
      flex-shrink: 0;
    }
    .error-alert__msg {
      flex: 1 1 auto;
    }
    `
  ]
})
export class ErrorAlert {
  @Input({ required: true }) message!: string;
}
