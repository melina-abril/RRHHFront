import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmploymentMovementsService } from '../../data-access/employment-movements.service';
import {
  CATEGORY_INFO, CategoryChangeRequest, DepartureRequest, EmploymentAction,
  EmploymentCategory, EmploymentMovementsResponse, MOVEMENT_INFO, RehireRequest, STATUS_INFO,
} from '../../models/employment-movements.models';

@Component({
  selector: 'app-employment-movements-page',
  imports: [DatePipe, ReactiveFormsModule, RouterLink, ConfirmDialog, EmptyState, ErrorAlert, LoadingState, StatusBadge],
  templateUrl: './employment-movements-page.html',
  styleUrl: './employment-movements-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentMovementsPage {
  readonly id = input<string>();

  private readonly service = inject(EmploymentMovementsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  protected readonly categoryInfo = CATEGORY_INFO;
  protected readonly statusInfo = STATUS_INFO;
  protected readonly movementInfo = MOVEMENT_INFO;
  protected readonly lookup = this.formBuilder.group({ employeeId: [''] });
  protected readonly form = this.formBuilder.group({
    effectiveDate: ['', Validators.required],
    category: ['PERMANENT' as EmploymentCategory, Validators.required],
    reason: ['', [Validators.required, Validators.maxLength(500)]],
  });
  protected readonly chosenAction = signal<EmploymentAction | null>(null);
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);
  protected readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly reviewing = signal(false);
  protected readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ id: this.id(), reload: this.reloadCount() }));
  protected readonly employeeState = toSignal(
    toObservable(this.request).pipe(
      switchMap(({ id }): Observable<LoadState<EmploymentMovementsResponse>> =>
        id ? toLoadState(this.service.getEmploymentMovements(id)) : of<LoadState<EmploymentMovementsResponse>>({ status: 'empty' }),
      ),
    ),
    { initialValue: { status: 'loading' } as LoadState<EmploymentMovementsResponse> },
  );
  protected readonly action = computed<EmploymentAction | null>(() => {
    const state = this.employeeState();
    if (state.status !== 'ready') return null;
    const employee = state.data;
    const selected = this.chosenAction();
    if (selected === 'REHIRE' && employee.status === 'INACTIVE') return selected;
    if (selected === 'DEPARTURE' && employee.status === 'ACTIVE') return selected;
    if (selected === 'CATEGORY_CHANGE' && employee.status === 'ACTIVE' && employee.category === 'INTERN') return selected;
    return employee.status === 'INACTIVE' ? 'REHIRE' : employee.category === 'INTERN' ? 'CATEGORY_CHANGE' : 'DEPARTURE';
  });

  protected openEmployee(): void {
    const id = this.lookup.controls.employeeId.value.trim();
    if (id) void this.router.navigate(['/employment-movements', id]);
  }

  protected selectAction(action: EmploymentAction): void {
    this.chosenAction.set(action);
    this.reviewing.set(false);
    this.saveError.set(null);
    this.serverErrors.set({});
    this.form.reset({ effectiveDate: '', category: 'PERMANENT', reason: '' });
  }

  protected errorFor(field: 'effectiveDate' | 'category' | 'reason'): string {
    const backendError = this.serverErrors()[field]?.[0];
    if (backendError) return backendError;
    const control = this.form.controls[field];
    if (!control.touched || control.valid) return '';
    return control.hasError('required') ? 'Este campo es obligatorio.' : 'Usa hasta 500 caracteres.';
  }

  protected review(): void {
    this.serverErrors.set({});
    if (this.form.invalid || !this.form.controls.reason.value.trim()) {
      this.form.markAllAsTouched();
      if (!this.form.controls.reason.value.trim()) this.form.controls.reason.setErrors({ required: true });
      return;
    }
    this.reviewing.set(true);
  }

  protected save(): void {
    const id = this.id();
    const action = this.action();
    const state = this.employeeState();
    if (!id || !action || state.status !== 'ready' || this.form.invalid || this.saving()) return;
    const { effectiveDate, category, reason } = this.form.getRawValue();
    const trimmedReason = reason.trim();
    let request: Observable<EmploymentMovementsResponse>;
    if (action === 'CATEGORY_CHANGE') {
      const body: CategoryChangeRequest = { effectiveDate, category: 'PERMANENT', reason: trimmedReason };
      request = this.service.changeCategory(id, body);
    } else if (action === 'DEPARTURE') {
      const body: DepartureRequest = { effectiveDate, reason: trimmedReason };
      request = this.service.registerDeparture(id, body);
    } else {
      const body: RehireRequest = { effectiveDate, category, reason: trimmedReason };
      request = this.service.registerRehire(id, body);
    }
    this.saving.set(true);
    this.saveError.set(null);
    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.reviewing.set(false);
        this.chosenAction.set(null);
        this.form.reset({ effectiveDate: '', category: 'PERMANENT', reason: '' });
        this.reload();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.reviewing.set(false);
        this.saveError.set(errorMessage(error));
        if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors);
        this.form.markAllAsTouched();
      },
    });
  }

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }
}
