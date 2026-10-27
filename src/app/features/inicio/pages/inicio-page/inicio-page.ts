import { Component, Signal, computed, inject } from '@angular/core';
import { InicioService } from '../../data-access/inicio.service';
import { LoadState } from 'src/app/shared/models/load-state';
import { InicioSummaryResponse } from '../../models/inicio.models';
import { LoadingState } from 'src/app/shared/components/loading-state';
import { ErrorAlert } from 'src/app/shared/components/error-alert';

@Component({
  selector: 'inicio-page',
  standalone: true,
  templateUrl: './inicio-page.html',
  styleUrl: './inicio-page.scss',
  imports: [LoadingState, ErrorAlert]
})
export class InicioPage {
  public readonly summaryState = inject(InicioService).summaryState;

  constructor() {
    inject(InicioService).loadSummary();
  }

  get bienvenida(): string {
    const st = this.summaryState();
    if (st.status === 'ready') {
      return st.data.bienvenida;
    }
    // Texto de bienvenida por defecto si no cargó
    return 'Bienvenido al sistema de Recursos Humanos de TECHFORB. Consultá la actividad general y accedé a los módulos desde un solo lugar.';
  }

  get indicacionAccesos(): string {
    const st = this.summaryState();
    if (st.status === 'ready') {
      return st.data.indicacionAccesos;
    }
    return 'Ingresá directamente al módulo que necesitás.';
  }

  // Accesos rápidos: textos por módulo
  get moduloSummaries() {
    const defaultSummaries = {
      gestionEmpleados: { nombre: 'Gestión de Empleados', descripcion: 'Legajos, perfiles y asignaciones' },
      sueldosBonos: { nombre: 'Sueldos y Bonos', descripcion: 'Remuneraciones y beneficios' },
      solicitudes: { nombre: 'Solicitudes', descripcion: 'Revisión y seguimiento de pedidos' },
      comunicados: { nombre: 'Comunicados', descripcion: 'Mensajes y registro de envíos' },
      horasExtras: { nombre: 'Horas Extras', descripcion: 'Autorizaciones y compensaciones' }
    };
    const st = this.summaryState();
    if (st.status === 'ready') {
      return {
        gestionEmpleados: st.data.gestionEmpleados,
        sueldosBonos: st.data.sueldosBonos,
        solicitudes: st.data.solicitudes,
        comunicados: st.data.comunicados,
        horasExtras: st.data.horasExtras
      };
    }
    return defaultSummaries;
  }
}
