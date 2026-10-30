import { RouterLink } from '@angular/router';
import { Component, signal, computed } from '@angular/core';
import { ColaboradoresService } from '../../data-access/colaboradores.service';
import type { ColaboradorResumen, FiltroColaboradores } from '../../models/colaboradores.models';
import { LoadState } from '../../../../shared/models/load-state';
import { effect } from '@angular/core';

@Component({
  selector: 'app-colaboradores-list-page',
  standalone: true,
  templateUrl: './colaboradores-list-page.html',
  styleUrl: './colaboradores-list-page.scss',
  imports: [RouterLink, ] // agregar componentes compartidos en base
})
export class ColaboradoresListPage {
  private service = new ColaboradoresService();

  filtro = signal<FiltroColaboradores>({});
  state = signal<LoadState<ColaboradorResumen[]>>({ status: 'loading' });

  busqueda = signal<string>('');
  categoria = signal<string>('');
  cliente = signal<string>('');
  proyecto = signal<string>('');
  estado = signal<string>('');
  showFilters = true;

  columns = [
    { field: 'legajo', title: 'Legajo' },
    { field: 'nombreCompleto', title: 'Nombre y Apellido' },
    { field: 'categoria', title: 'Categoría' },
    { field: 'cliente', title: 'Cliente' },
    { field: 'proyecto', title: 'Proyecto' },
    { field: 'rolLaboral', title: 'Rol' }, // Not present in resumen, keep for pattern
    { field: 'fechaIngreso', title: 'Fecha de ingreso' }, // Not present in resumen
    { field: 'estado', title: 'Estado' },
    { field: 'acciones', title: 'Acciones', actions: true }
  ];

  trackById = (i: number, c: ColaboradorResumen) => c.id;

  colaboradores = computed(() => {
    const s = this.state();
    return s.status === 'ready' ? s.data : [];
  });

  activosCount = computed(() => {
    return this.colaboradores().filter(c => c.estado === 'ACTIVO').length;
  });

  totalCount = computed(() => {
    return this.colaboradores().length;
  });

  sinFiltros = computed(() => {
    return !this.busqueda() && !this.categoria() && !this.cliente() && !this.proyecto() && !this.estado();
  });

  constructor() {
    effect(() => {
      this.cargarColaboradores();
    });
  }

  async cargarColaboradores() {
    this.state.set({ status: 'loading' });
    try {
      const result = await this.service.listColaboradores({
        busqueda: this.busqueda(),
        categoria: this.categoria(),
        cliente: this.cliente(),
        proyecto: this.proyecto(),
        estado: this.estado()
      });
      const datos = result.items || [];
      if (datos.length === 0) {
        this.state.set({ status: 'empty' });
      } else {
        this.state.set({ status: 'ready', data: datos });
      }
    } catch (e: any) {
      this.state.set({ status: 'error', error: e?.error || 'Error al cargar colaboradores' });
    }
  }

  aplicarFiltros(filtro: FiltroColaboradores) {
    this.busqueda.set(filtro.busqueda || '');
    this.categoria.set(filtro.categoria || '');
    this.cliente.set(filtro.cliente || '');
    this.proyecto.set(filtro.proyecto || '');
    this.estado.set(filtro.estado || '');
    this.cargarColaboradores();
  }

  limpiarFiltros() {
    this.busqueda.set('');
    this.categoria.set('');
    this.cliente.set('');
    this.proyecto.set('');
    this.estado.set('');
    this.cargarColaboradores();
  }

  abrirFicha(colaborador: ColaboradorResumen) {
    // @todo: navegar a ficha usando router
  }

  editarColaborador(colaborador: ColaboradorResumen) {
    // @todo: navegar a edición usando router
  }
}
