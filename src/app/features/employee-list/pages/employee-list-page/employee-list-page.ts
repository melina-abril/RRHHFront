import { Component, signal, computed, effect } from '@angular/core';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet, NgClass, NgModel, FormsModule } from '@angular/common';
import { EmployeeListService } from '../../data-access/employee-list.service';
import { EmployeeListItemSummary, EmployeeListFilterRequest, EmployeeListPageResponse } from '../../models/employee-list.models';
import { LoadState } from 'src/app/shared/models/load-state';
import { PageHeader } from 'src/app/shared/components/page-header';
import { LoadingState } from 'src/app/shared/components/loading-state';
import { ErrorAlert } from 'src/app/shared/components/error-alert';
import { EmptyState } from 'src/app/shared/components/empty-state';
import { EmployeeTable } from '../../components/employee-table';
import { Router } from '@angular/router';

@Component({
  selector: 'employee-list-page',
  standalone: true,
  imports: [
    NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, NgTemplateOutlet, NgClass, NgModel, FormsModule,
    PageHeader, LoadingState, ErrorAlert, EmptyState, EmployeeTable
  ],
  templateUrl: './employee-list-page.html',
  styleUrl: './employee-list-page.scss'
})
export class EmployeeListPage {
  filters: EmployeeListFilterRequest = {
    search: '',
    categoria: '',
    cliente: '',
    proyecto: '',
    estado: ''
  };
  state = signal<LoadState<EmployeeListPageResponse>>({ status: 'loading' });

  activeCount = 0;
  totalCount = 0;

  constructor(
    private svc: EmployeeListService,
    private router: Router
  ) {
    this.fetchList();
  }

  // Verifica si los filtros están en valores iniciales
  get isAllDefaultFilters(): boolean {
    return (
      !this.filters.search &&
      !this.filters.categoria &&
      !this.filters.cliente &&
      !this.filters.proyecto &&
      !this.filters.estado
    );
  }

  fetchList(): void {
    this.state.set({ status: 'loading' });
    this.svc.getEmployeeList(this.filters).subscribe({
      next: resp => {
        if (!resp.items.length) {
          this.state.set({ status: 'empty' });
          this.totalCount = 0;
          this.activeCount = 0;
        } else {
          this.state.set({ status: 'ready', data: resp });
          this.totalCount = resp.total;
          this.activeCount = resp.items.filter(emp => emp.estado === 'Activo').length;
        }
      },
      error: err => {
        this.state.set({ status: 'error', message: err.message || 'Ocurrió un error al cargar el listado.' });
        this.totalCount = 0;
        this.activeCount = 0;
      }
    });
  }

  applyFilters(): void {
    this.filters.page = 0;
    this.fetchList();
  }

  resetFilters(): void {
    this.filters = { search: '', categoria: '', cliente: '', proyecto: '', estado: '' };
    this.applyFilters();
  }

  onNewEmployee(): void {
    // Navega a la ruta de alta (no implementada en este módulo)
    this.router.navigate(['/colaboradores/nuevo']); // Reemplazar con el path final
  }

  onViewProfile(legajo: string): void {
    // Navega a la ficha del colaborador (no implementada en este módulo)
    this.router.navigate(['/colaboradores', legajo]); // Reemplazar con el path final
  }
}
