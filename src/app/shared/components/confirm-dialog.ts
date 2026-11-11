import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, input, output, viewChild } from '@angular/core';

/**
 * Confirmación antes de una acción destructiva. Se muestra con @if desde la página:
 * @if (confirmingDelete()) { <app-confirm-dialog ... (confirmed)="delete()" (cancelled)="confirmingDelete.set(false)" /> }
 */
@Component({
  selector: 'app-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'cancel()' },
  template: `<div class="dialog-backdrop">
    <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-message">
      <h2 id="confirm-dialog-title">{{ title() }}</h2>
      <p id="confirm-dialog-message">{{ message() }}</p>
      <div class="dialog__actions">
        <button #cancelButton type="button" class="button button--secondary" [disabled]="busy()" (click)="cancel()">
          {{ cancelLabel() }}
        </button>
        <button type="button" class="button button--danger" [disabled]="busy()" (click)="confirmed.emit()">{{ confirmLabel() }}</button>
      </div>
    </div>
  </div>`,
})
export class ConfirmDialog {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Confirmar');
  readonly cancelLabel = input('Cancelar');
  /** true mientras corre la acción confirmada: deshabilita los botones. */
  readonly busy = input(false);
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  private readonly cancelButton = viewChild.required<ElementRef<HTMLButtonElement>>('cancelButton');

  constructor() {
    // Foco en "Cancelar" al abrir: la opción segura.
    afterNextRender(() => this.cancelButton().nativeElement.focus());
  }

  protected cancel(): void {
    if (!this.busy()) this.cancelled.emit();
  }
}
