import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Estado vacío. Contenido proyectado opcional para una acción (ej. un botón "Crear"). */
@Component({
  selector: 'app-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="empty-state" role="status">
    <p>{{ message() }}</p>
    <ng-content />
  </div>`,
})
export class EmptyState {
  readonly message = input.required<string>();
}
