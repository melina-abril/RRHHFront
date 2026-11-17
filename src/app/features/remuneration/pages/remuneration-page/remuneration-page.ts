import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { MoneyPipe } from '../../../../shared/pipes/money.pipe';
import { RemunerationService } from '../../data-access/remuneration.service';
import { REMUNERATION_CURRENCIES, REMUNERATION_STATUS, RemunerationCurrency, RemunerationHistoryResponse, RemunerationPeriodResponse, RemunerationRequest } from '../../models/remuneration.models';

type RemunerationField = keyof RemunerationRequest;

@Component({
  selector: 'app-remuneration-page',
  imports: [DatePipe, ReactiveFormsModule, RouterLink, EmptyState, ErrorAlert, LoadingState, StatusBadge, MoneyPipe],
  templateUrl: './remuneration-page.html',
  styleUrl: './remuneration-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemunerationPage {
  readonly id = input<string>();

  private readonly service = inject(RemunerationService);
  private readonly currentUser = inject(CurrentUser);
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ id: this.id(), reload: this.reloadCount() }));

  protected readonly statusInfo = REMUNERATION_STATUS;
  protected readonly currencies = REMUNERATION_CURRENCIES;
  protected readonly canEdit = computed(() => this.currentUser.hasRole(['ADMIN']));
  protected readonly historyState = toSignal(
    toObservable(this.request).pipe(
      switchMap(({ id }) => {
        if (!id) return of<LoadState<RemunerationHistoryResponse>>({ status: 'empty' });
        return this.service.listRemunerationPeriods(id).pipe(
          map((data): LoadState<RemunerationHistoryResponse> => ({ status: 'ready', data })),
          startWith({ status: 'loading' } as LoadState<RemunerationHistoryResponse>),
          catchError((error: unknown) => of<LoadState<RemunerationHistoryResponse>>({
            status: 'error',
            message: error instanceof ApiProblemError && error.status === 404
              ? 'No se encontró el colaborador'
              : 'No se pudo cargar la información. Intenta nuevamente',
          })),
        );
      }),
    ),
    { initialValue: { status: 'loading' } as LoadState<RemunerationHistoryResponse> },
  );

  protected readonly form = inject(NonNullableFormBuilder).group({
    amount: [0, [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    currency: ['ARS' as RemunerationCurrency, Validators.required],
    effectiveDate: ['', Validators.required],
    reason: ['', [Validators.required, Validators.pattern(/.*\S.*/), Validators.maxLength(500)]],
  });
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);
  private readonly serverErrors = signal<Record<string, string[]>>({});

  protected currentPeriod(periods: readonly RemunerationPeriodResponse[]): RemunerationPeriodResponse | undefined {
    return periods.find((period) => period.status === 'CURRENT');
  }

  protected errorFor(field: RemunerationField): string {
    const serverMessage = this.serverErrors()[field]?.[0];
    if (serverMessage) return serverMessage;
    const control = this.form.controls[field];
    if (!control.touched || control.valid) return '';
    if (field === 'amount') return 'Ingresa un importe mayor a cero con hasta dos decimales.';
    if (field === 'effectiveDate') return 'Ingresa una fecha válida.';
    if (field === 'reason') return 'Ingresa un motivo de hasta 500 caracteres.';
    return 'Selecciona una moneda.';
  }

  protected retry(): void {
    this.reloadCount.update((count) => count + 1);
  }

  protected cancel(): void {
    this.form.reset({ amount: 0, currency: 'ARS', effectiveDate: '', reason: '' });
    this.serverErrors.set({});
    this.saveError.set(null);
  }

  protected submit(): void {
    const id = this.id();
    if (!id || this.saving()) return;
    this.serverErrors.set({});
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request: RemunerationRequest = {
      ...this.form.getRawValue(),
      reason: this.form.controls.reason.value.trim(),
    };
    if (!request.reason) {
      this.form.controls.reason.setErrors({ required: true });
      this.form.controls.reason.markAsTouched();
      return;
    }
    this.saving.set(true);
    this.saveError.set(null);
    this.service.createRemunerationPeriod(id, request).subscribe({
      next: () => {
        this.saving.set(false);
        this.cancel();
        this.retry();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.saveError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
        this.form.markAllAsTouched();
      },
    });
  }
}
