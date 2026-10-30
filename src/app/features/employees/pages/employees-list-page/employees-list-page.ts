import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe, AsyncPipe } from '@angular/common';
import { EmployeesService } from '../../data-access/employees.service';
import { Employee, EmployeeFilters, EmployeeCategory, EmployeeWorkMode, EmployeeDedication, EmployeeState, EMPLOYEE_CATEGORY_OPTIONS, EMPLOYEE_STATE_OPTIONS } from '../../models/employees.models';
import { Page, toPage } from '../../../../shared/models/page';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadingState } from '../../../../shared/components/loading-state';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { EmployeeFiltersBar } from '../../components/employee-filters-bar';

@Component({
  selector: 'app-employees-list-page',
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe, AsyncPipe, PageHeader, LoadingState, EmptyState, ErrorAlert, StatusBadge, EmployeeFiltersBar],
  templateUrl: './employees-list-page.html',
  styleUrl: './employees-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesListPage {
  private readonly service = inject(EmployeesService);
  private readonly router = inject(Router);

  protected readonly filters = signal<EmployeeFilters>({
    name: '',
    fileNumber: '',
    category: null,
    client: '',
    project: '',
    state: null,
    page: 0,
    size: 20,
  });

  protected readonly reloadCount = signal(0);

  protected readonly employeesState = computed(() => {
    return toLoadState(this.service.list(this.filters()), (data) => !data.items.length);
  });

  protected onFiltersChange(newFilters: Partial<EmployeeFilters>): void {
    this.filters.set({ ...this.filters(), ...newFilters, page: 0 });
  }

  protected onPageChange(page: number): void {
    this.filters.set({ ...this.filters(), page });
  }

  protected readonly categoryOptions = EMPLOYEE_CATEGORY_OPTIONS;
  protected readonly stateOptions = EMPLOYEE_STATE_OPTIONS;
  protected readonly columns = [
    { key: 'fileNumber', label: 'Legajo' },
    { key: 'name', label: 'Nombre' },
    { key: 'category', label: 'Categoría' },
    { key: 'client', label: 'Cliente' },
    { key: 'project', label: 'Proyecto' },
    { key: 'state', label: 'Estado' }
  ];
}
