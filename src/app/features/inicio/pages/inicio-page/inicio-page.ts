import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { InicioService } from '../../data-access/inicio.service';
import { InicioResumen } from '../../models/inicio.models';
import { LoadState } from '../../../../shared/models/load-state';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss'
})
export class InicioPage {
  private readonly inicioService = new InicioService();

  protected resumenState = signal<LoadState<InicioResumen>>({ status: 'loading' });

  constructor() {
    this.cargarResumen();
  }

  cargarResumen() {
    this.resumenState.set({ status: 'loading' });
    this.inicioService.getResumen().subscribe({
      next: (data) => {
        if (!data || typeof data !== 'object') {
          this.resumenState.set({ status: 'empty' });
        } else {
          this.resumenState.set({ status: 'ready', data });
        }
      },
      error: (err) => {
        this.resumenState.set({ status: 'error', error: err?.message || 'Error al cargar el resumen' });
      }
    });
  }

  /**
   * Accesos rápidos configurados para las tarjetas (nombre, descripción, iconId, link)
   */
  readonly accesos = [
    {
      nombre: 'Gestión de Empleados',
      descripcion: 'Legajos, perfiles y asignaciones',
      iconId: 'mk-people',
      link: '/colaboradores'
    },
    {
      nombre: 'Sueldos y Bonos',
      descripcion: 'Remuneraciones y beneficios',
      iconId: 'mk-money',
      link: '/sueldos-y-bonos'
    },
    {
      nombre: 'Solicitudes',
      descripcion: 'Revisión y seguimiento de pedidos',
      iconId: 'mk-request',
      link: '/solicitudes'
    },
    {
      nombre: 'Comunicados',
      descripcion: 'Mensajes y registro de envíos',
      iconId: 'mk-message',
      link: '/comunicados'
    },
    {
      nombre: 'Horas Extras',
      descripcion: 'Autorizaciones y compensaciones',
      iconId: 'mk-clock',
      link: '/horas-extras'
    }
  ];
}
