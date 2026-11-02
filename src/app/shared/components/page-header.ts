import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Título de la página, descripción opcional y acciones proyectadas a la derecha. */
@Component({
  selector: 'app-page-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<header class="page-header">
    <div>
      <h1>{{ title() }}</h1>
      @if (description()) {
        <p>{{ description() }}</p>
      }
    </div>
    <div class="page-header__actions"><ng-content /></div>
  </header>`,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input('');
}
