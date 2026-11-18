import { Pipe, PipeTransform } from '@angular/core';

/** Importe con el formato es-AR: 1234567.8 | money → '$ 1.234.567,80'; 'USD' como parámetro para dólares. */
@Pipe({ name: 'money' })
export class MoneyPipe implements PipeTransform {
  private readonly formatters = new Map<string, Intl.NumberFormat>();

  transform(value: number | null | undefined, currency = 'ARS'): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return '—';
    let formatter = this.formatters.get(currency);
    if (!formatter) {
      formatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 });
      this.formatters.set(currency, formatter);
    }
    return formatter.format(value).replace(/[  ]/g, ' ');
  }
}
