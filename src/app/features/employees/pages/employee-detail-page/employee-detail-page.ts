import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { errorMessage } from '../../../../core/http/api-error';
import { CurrentUser } from '../../../../core/session/current-user';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_STATUS, EmployeeDto } from '../../models/employees.models';

type EmployeeSection = 'personal' | 'work' | 'assignments' | 'profile' | 'documents' | 'benefits' | 'reviews' | 'journal' | 'payroll';

@Component({
  selector: 'app-employee-detail-page',
  imports: [RouterLink, DatePipe, ReactiveFormsModule, ConfirmDialog, EmptyState, ErrorAlert, LoadingState, StatusBadge],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  readonly id = input.required<string>();
  private readonly service = inject(EmployeesService);
  private readonly currentUser = inject(CurrentUser);
  protected readonly canEdit = computed(() => this.currentUser.hasRole(['ADMIN']));
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly section = signal<EmployeeSection>('personal');
  protected readonly sections: readonly { id: EmployeeSection; label: string }[] = [
    { id: 'personal', label: 'Datos personales' },
    { id: 'work', label: 'Información laboral' },
    { id: 'assignments', label: 'Asignaciones' },
    { id: 'profile', label: 'Perfil técnico' },
    { id: 'documents', label: 'Documentación' },
    { id: 'benefits', label: 'Beneficios' },
    { id: 'reviews', label: 'Evaluaciones' },
    { id: 'journal', label: 'Bitácora' },
    { id: 'payroll', label: 'Sueldos y Bonos' },
  ];
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ id: this.id(), reload: this.reloadCount() }));
  protected readonly employeeState = toSignal(
    toObservable(this.request).pipe(switchMap(({ id }) => toLoadState(this.service.getEmployeeById(id)))),
    { initialValue: { status: 'loading' } as LoadState<EmployeeDto> },
  );
  protected readonly confirmingLeave = signal(false);
  protected readonly confirmingRejoin = signal(false);
  protected readonly working = signal(false);
  protected readonly actionError = signal<string | null>(null);
  protected readonly rejoinForm = inject(NonNullableFormBuilder).group({ hireDate: ['', Validators.required] });

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }

  protected leave(): void {
    if (this.working()) return;
    this.working.set(true);
    this.actionError.set(null);
    this.service.leaveEmployee(this.id()).subscribe({
      next: () => {
        this.working.set(false);
        this.confirmingLeave.set(false);
        this.reload();
      },
      error: (error: unknown) => {
        this.working.set(false);
        this.confirmingLeave.set(false);
        this.actionError.set(errorMessage(error));
      },
    });
  }

  protected rejoin(): void {
    if (this.working()) return;
    if (this.rejoinForm.invalid) {
      this.rejoinForm.markAllAsTouched();
      return;
    }
    this.working.set(true);
    this.actionError.set(null);
    this.service.rejoinEmployee(this.id(), this.rejoinForm.controls.hireDate.value).subscribe({
      next: () => {
        this.working.set(false);
        this.confirmingRejoin.set(false);
        this.rejoinForm.reset();
        this.reload();
      },
      error: (error: unknown) => {
        this.working.set(false);
        this.confirmingRejoin.set(false);
        this.actionError.set(errorMessage(error));
      },
    });
  }
}
