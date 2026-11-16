import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { EmployeesService } from '../../data-access/employees.service';
import { EMPLOYEE_CATEGORY, EMPLOYEE_DEDICATION, EMPLOYEE_STATUS, EMPLOYEE_WORK_MODE, Employee } from '../../models/employees.models';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';

type SectionId = 'datos-personales' | 'asignaciones' | 'documentos' | 'beneficios' | 'evaluaciones';

@Component({
  selector: 'app-employee-detail-page',
  imports: [RouterLink, DatePipe, ErrorAlert, LoadingState, StatusBadge],
  templateUrl: './employee-detail-page.html',
  styleUrl: './employee-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeDetailPage {
  readonly id = input.required<string>();
  private readonly service = inject(EmployeesService);
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ id: this.id(), reload: this.reloadCount() }));
  protected readonly employeeState = toSignal(
    toObservable(this.request).pipe(switchMap(({ id }) => toLoadState(this.service.get(id)))),
    { initialValue: { status: 'loading' } as LoadState<Employee> },
  );
  protected readonly activeSection = signal<SectionId>('datos-personales');
  protected readonly statusInfo = EMPLOYEE_STATUS;
  protected readonly categoryInfo = EMPLOYEE_CATEGORY;
  protected readonly dedicationInfo = EMPLOYEE_DEDICATION;
  protected readonly workModeInfo = EMPLOYEE_WORK_MODE;

  protected scrollTo(section: SectionId): void {
    this.activeSection.set(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected reload(): void {
    this.reloadCount.update(count => count + 1);
  }
}
