import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of, switchMap, tap } from 'rxjs';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { CurrentUser } from '../../../../core/session/current-user';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { BenefitsService } from '../../data-access/benefits.service';
import { BENEFIT_LABELS, BENEFIT_STATUSES, CATEGORY_LABELS, BenefitAdjustmentRequest, BenefitBalanceResponse, BenefitBalancesResponse, BenefitMovementResponse, BenefitType } from '../../models/benefits.models';

@Component({
  selector: 'app-benefits-page',
  imports: [DatePipe, ReactiveFormsModule, LoadingState, EmptyState, ErrorAlert],
  templateUrl: './benefits-page.html',
  styleUrl: './benefits-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BenefitsPage {
  readonly id = input<string>();

  private readonly service = inject(BenefitsService);
  private readonly currentUser = inject(CurrentUser);
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ id: this.id(), reload: this.reloadCount() }));

  protected readonly labels = BENEFIT_LABELS;
  protected readonly statuses = BENEFIT_STATUSES;
  protected readonly categories = CATEGORY_LABELS;
  protected readonly selectedType = signal<BenefitType | null>(null);
  protected readonly updatedAt = signal<string | null>(null);
  protected readonly saveError = signal<string | null>(null);
  protected readonly saving = signal(false);
  protected readonly saved = signal(false);
  protected readonly form = inject(NonNullableFormBuilder).group({
    direction: ['add' as 'add' | 'subtract'],
    amount: [1, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
    reason: ['', [Validators.required, Validators.maxLength(500)]],
  });

  protected readonly balanceState = toSignal(
    toObservable(this.request).pipe(
      switchMap(({ id }): Observable<LoadState<BenefitBalancesResponse>> => {
        this.updatedAt.set(null);
        return id
          ? toLoadState(this.service.getBenefitBalances(id)).pipe(
              tap((state) => {
                if (state.status === 'ready') this.updatedAt.set(new Date().toISOString());
              }),
            )
          : of<LoadState<BenefitBalancesResponse>>({ status: 'empty' });
      }),
    ),
    { initialValue: { status: 'loading' } as LoadState<BenefitBalancesResponse> },
  );

  protected readonly movementState = toSignal(
    toObservable(this.request).pipe(
      switchMap(({ id }): Observable<LoadState<BenefitMovementResponse[]>> =>
        id ? toLoadState(this.service.listBenefitMovements(id)) : of<LoadState<BenefitMovementResponse[]>>({ status: 'empty' }),
      ),
    ),
    { initialValue: { status: 'loading' } as LoadState<BenefitMovementResponse[]> },
  );

  protected readonly selectedBalance = computed((): BenefitBalanceResponse | null => {
    const state = this.balanceState();
    if (state.status !== 'ready') return null;
    const type = this.selectedType();
    return (type ? state.data.balances.find((balance) => balance.benefitType === type) : state.data.balances[0]) ?? null;
  });

  protected readonly visibleMovements = computed((): BenefitMovementResponse[] => {
    const state = this.movementState();
    const selected = this.selectedBalance();
    return state.status === 'ready' && selected
      ? state.data.filter((movement) => movement.benefitType === selected.benefitType)
      : [];
  });

  protected selectBenefit(type: BenefitType): void {
    this.selectedType.set(type);
    this.saved.set(false);
    this.saveError.set(null);
  }

  protected retry(): void {
    this.reloadCount.update((count) => count + 1);
  }

  protected errorFor(field: 'amount' | 'reason'): string {
    const control = this.form.controls[field];
    if (!control.touched || !control.invalid) return '';
    return field === 'amount' ? 'Ingresa una cantidad positiva de días completos.' : 'Ingresa una justificación de hasta 500 caracteres.';
  }

  protected submit(): void {
    this.saveError.set(null);
    this.saved.set(false);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const id = this.id();
    const selected = this.selectedBalance();
    if (!id || !selected || selected.status === 'NOT_APPLICABLE') return;
    const { direction, amount, reason } = this.form.getRawValue();
    const request: BenefitAdjustmentRequest = {
      benefitType: selected.benefitType,
      amount: direction === 'subtract' ? -amount : amount,
      reason: reason.trim(),
    };
    if (!Number.isInteger(request.amount) || request.amount === 0 || !request.reason) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.service.createBenefitAdjustment(id, request).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        this.form.controls.reason.reset();
        this.retry();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.saveError.set(errorMessage(error));
        if (error instanceof ApiProblemError && Object.keys(error.fieldErrors).length) this.form.markAllAsTouched();
      },
    });
  }
}
