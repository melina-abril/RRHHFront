import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

/** Etiqueta de estado. El módulo decide el texto y el tono de cada valor (ver PRODUCT_STATUS en el ejemplo). */
@Component({
  selector: 'app-status-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span [class]="classes()">{{ label() }}</span>`,
})
export class StatusBadge {
  readonly label = input.required<string>();
  readonly tone = input<BadgeTone>('neutral');
  protected readonly classes = computed(() => `status-badge status-badge--${this.tone()}`);
}
