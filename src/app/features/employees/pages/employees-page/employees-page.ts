import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { EmployeesService } from '../../data-access/employees.service';
import { EmployeeCategory, EmployeeResponse, EmployeeStatus } from '../../models/employees.models';

@Component({
  selector: 'app-employees-page',
  imports: [DatePipe, RouterLink, PageHeader, LoadingState, EmptyState, ErrorAlert],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesPage {
  private readonly employeesService = inject(EmployeesService);
  private readonly reloadCount = signal(0);

  protected readonly search = signal('');
  protected readonly category = signal<EmployeeCategory | ''>('');
  protected readonly status = signal<EmployeeStatus | ''>('');
  protected readonly client = signal('');
  protected readonly project = signal('');

  protected readonly employeesState = toSignal(
    toObservable(this.reloadCount).pipe(switchMap(() => toLoadState(this.employeesService.listEmployees()))),
    { initialValue: { status: 'loading' } as LoadState<EmployeeResponse[]> },
  );

  protected readonly filteredState = computed<LoadState<EmployeeResponse[]>>(() => {
    const state = this.employeesState();
    if (state.status !== 'ready') return state;

    const search = this.search().trim().toLocaleLowerCase();
    const client = this.client().trim().toLocaleLowerCase();
    const project = this.project().trim().toLocaleLowerCase();
    const category = this.category();
    const status = this.status();
    const matches = state.data.filter((employee) =>
      (!search || `${employee.firstName} ${employee.lastName}`.toLocaleLowerCase().includes(search)) &&
      (!category || employee.category === category) &&
      (!status || employee.status === status) &&
      (!client || (employee.initialClient ?? '').toLocaleLowerCase().includes(client)) &&
      (!project || (employee.initialProject ?? '').toLocaleLowerCase().includes(project)),
    );
    return matches.length ? { status: 'ready', data: matches } : { status: 'empty' };
  });

  protected onSearch(value: string): void {
    this.search.set(value);
  }

  protected clearSearch(): void {
    this.search.set('');
  }

  protected onCategory(value: string): void {
    this.category.set(value === 'PERMANENT' || value === 'INTERN' ? value : '');
  }

  protected onStatus(value: string): void {
    this.status.set(value === 'ACTIVE' || value === 'INACTIVE' ? value : '');
  }

  protected onClient(value: string): void {
    this.client.set(value);
  }

  protected onProject(value: string): void {
    this.project.set(value);
  }

  protected reload(): void {
    this.reloadCount.update((value) => value + 1);
  }
}
