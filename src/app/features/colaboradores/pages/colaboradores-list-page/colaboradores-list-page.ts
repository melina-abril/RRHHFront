import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColaboradoresService } from '../../data-access/colaboradores.service';
import { ColaboradorResumen, FiltroColaboradores } from '../../models/colaboradores.models';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-colaboradores-list-page',
  standalone: true,
  templateUrl: './colaboradores-list-page.html',
  styleUrl: './colaboradores-list-page.scss',
  imports: [CommonModule, RouterLink]
})
export class ColaboradoresListPage {
  private readonly servicio = new ColaboradoresService();
  public readonly filtros = signal<FiltroColaboradores>({
    busqueda: '',
    categoria: undefined,
    cliente: undefined,
    proyecto: undefined,
    estado: undefined
  });

  public readonly pagina = signal<number>(1);
  public readonly cantidadPorPagina = 20;

  public readonly colaboradoresState = signal<LoadState<Page<ColaboradorResumen>>>({ status: 'loading' });

  constructor(private readonly router: Router) {
    this.cargarColaboradores();
  }

  cargarColaboradores(): void {
    this.colaboradoresState.set({ status: 'loading' });
    this.servicio.listColaboradores({ ...this.filtros(), page: this.pagina(), size: this.cantidadPorPagina }).subscribe({
      next: (page) => {
        if (page.total === 0) {
          this.colaboradoresState.set({ status: 'empty' });
        } else {
          this.colaboradoresState.set({ status: 'ready', data: page });
        }
      },
      error: (err) => {
        this.colaboradoresState.set({ status: 'error', error: (typeof err === 'string' ? err : 'Ha ocurrido un error al cargar los colaboradores.') });
      }
    });
  }

  onBuscar(busqueda: string): void {
    this.filtros.update(valor => ({ ...valor, busqueda }));
    this.pagina.set(1);
    this.cargarColaboradores();
  }

  onFiltrar(filtro: Partial<FiltroColaboradores>): void {
    this.filtros.update(valor => ({ ...valor, ...filtro }));
    this.pagina.set(1);
    this.cargarColaboradores();
  }

  onPagina(page: number): void {
    this.pagina.set(page);
    this.cargarColaboradores();
  }

  verDetalle(id: number): void {
    this.router.navigate(['/colaboradores', id]);
  }

  editar(id: number): void {
    this.router.navigate(['/colaboradores', id, 'editar']);
  }
}