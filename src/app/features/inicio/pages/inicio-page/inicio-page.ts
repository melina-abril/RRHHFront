import { RouterLink } from '@angular/router';
import { Component, Signal, computed, effect, inject, signal } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf, NgFor, NgClass } from '@angular/common';
import { InicioService } from '../../data-access/inicio.service';
import { InicioSummaryResponse } from '../../models/inicio.models';
import { LoadState } from 'src/app/shared/models/load-state';
import { PageHeader } from 'src/app/shared/components/page-header';
import { LoadingState } from 'src/app/shared/components/loading-state';
import { EmptyState } from 'src/app/shared/components/empty-state';
import { ErrorAlert } from 'src/app/shared/components/error-alert';

@Component({
  selector: 'app-inicio-page',
  standalone: true,
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss',
  imports: [RouterLink, NgIf, NgFor, NgClass, AsyncPipe, DatePipe, PageHeader, LoadingState, EmptyState, ErrorAlert]
})
export class InicioPage {
  private readonly inicioService = inject(InicioService);
  public readonly state: Signal<LoadState<InicioSummaryResponse>> = this.inicioService.resumen;

  public readonly moduloLinks = [
    {
      key: 'gestionEmpleados',
      icon: 'mk-people',
      href: '/empleados'
    },
    {
      key: 'sueldosBonos',
      icon: 'mk-money',
      href: '/sueldos-y-bonos'
    },
    {
      key: 'solicitudes',
      icon: 'mk-request',
      href: '/solicitudes'
    },
    {
      key: 'comunicados',
      icon: 'mk-message',
      href: '/comunicados'
    },
    {
      key: 'horasExtras',
      icon: 'mk-clock',
      href: '/horas-extras'
    }
  ];

  public readonly cardIcons = {
    colaboradores: 'mk-people',
    solicitudes: 'mk-request',
    eventos: 'mk-calendar'
  };
}
