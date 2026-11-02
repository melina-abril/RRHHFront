import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="loading-state" role="status" aria-live="polite">
    <span class="loading-state__spinner" aria-hidden="true"></span>{{ message() }}
  </div>`,
})
export class LoadingState {
  readonly message = input('Cargando…');
}
