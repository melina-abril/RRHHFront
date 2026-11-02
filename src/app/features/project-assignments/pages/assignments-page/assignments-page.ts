import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ApiProblemError } from '../../../../core/http/api-error';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { ProjectAssignmentsService } from '../../data-access/project-assignments.service';
import { AssignmentDto, EmployeeAssignmentsDto } from '../../models/project-assignments.models';

@Component({ selector: 'app-assignments-page', imports: [RouterLink, DatePipe, ReactiveFormsModule, PageHeader, LoadingState, ErrorAlert, EmptyState, StatusBadge, ConfirmDialog], templateUrl: './assignments-page.html', styleUrl: './assignments-page.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class AssignmentsPage {
  readonly employeeId = input<string>();
  private readonly service = inject(ProjectAssignmentsService);
  private readonly router = inject(Router);
  protected readonly employeeSearch = signal('');
  protected readonly reloadCount = signal(0);
  protected readonly request = computed(() => ({ employeeId: this.employeeId(), reload: this.reloadCount() }));
  protected readonly assignmentsState = toSignal(toObservable(this.request).pipe(switchMap(({ employeeId }) => employeeId ? toLoadState(this.service.listEmployeeAssignments(employeeId), data => !data.active.length && !data.ended.length) : of<LoadState<EmployeeAssignmentsDto>>({ status: 'empty' }))), { initialValue: { status: 'loading' } as LoadState<EmployeeAssignmentsDto> });
  protected readonly selected = signal<AssignmentDto | null>(null);
  protected readonly confirming = signal(false);
  protected readonly busy = signal(false);
  protected readonly actionError = signal<string | null>(null);
  protected readonly success = signal('');
  protected readonly finalizeForm = inject(NonNullableFormBuilder).group({ endDate: ['', Validators.required] });
  protected search(): void { const id = this.employeeSearch().trim(); if (id) void this.router.navigate(['/project-assignments/assignments', id]); }
  protected reload(): void { this.reloadCount.update(n => n + 1); }
  protected askFinalize(assignment: AssignmentDto): void { this.selected.set(assignment); this.finalizeForm.reset(); this.actionError.set(null); this.confirming.set(false); }
  protected confirmFinalize(): void {
    const item = this.selected(); const endDate = this.finalizeForm.controls.endDate.value;
    if (!item || this.finalizeForm.invalid || endDate < item.startDate.slice(0, 10)) { this.finalizeForm.markAllAsTouched(); this.actionError.set('Revisá los datos indicados'); return; }
    this.confirming.set(true);
  }
  protected finalize(): void {
    const item = this.selected(); const employeeId = this.employeeId();
    if (!item || !employeeId) return;
    this.busy.set(true); this.actionError.set(null);
    this.service.finalizeEmployeeAssignment(employeeId, item.id, this.finalizeForm.getRawValue()).subscribe({
      next: () => { this.busy.set(false); this.selected.set(null); this.confirming.set(false); this.success.set('Cambios guardados correctamente'); this.reload(); },
      error: (error: unknown) => { this.busy.set(false); this.confirming.set(false); this.actionError.set(error instanceof ApiProblemError && [404, 409, 422].includes(error.status) ? error.status === 404 ? 'No se encontró el registro solicitado' : 'Revisá los datos indicados' : 'No se pudieron guardar los cambios. Intentá nuevamente'); },
    });
  }
}
