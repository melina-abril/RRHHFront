import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

/** Error para el usuario (el detail del ProblemDetail). Con retryLabel muestra un botón de reintento. */
@Component({
  selector: 'app-error-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="error-alert" role="alert">
    <span>{{ message() }}</span>
    @if (retryLabel()) {
      <button type="button" class="button button--secondary" (click)="retry.emit()">{{ retryLabel() }}</button>
    }
  </div>`,
})
export class ErrorAlert {
  readonly message = input.required<string>();
  readonly retryLabel = input('');
  readonly retry = output<void>();
}
