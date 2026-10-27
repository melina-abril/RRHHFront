import { InicioSummaryResponse } from '../models/inicio.models';

export const inicioSummaryMock: InicioSummaryResponse = {
  totalColaboradores: 27,
  solicitudesPendientes: 3,
  proximoEvento: '2024-07-01',
  gestionEmpleados: {
    nombre: 'Gestión de Empleados',
    descripcion: 'Legajos, perfiles y asignaciones'
  },
  sueldosBonos: {
    nombre: 'Sueldos y Bonos',
    descripcion: 'Remuneraciones y beneficios'
  },
  solicitudes: {
    nombre: 'Solicitudes',
    descripcion: 'Revisión y seguimiento de pedidos'
  },
  comunicados: {
    nombre: 'Comunicados',
    descripcion: 'Mensajes y registro de envíos'
  },
  horasExtras: {
    nombre: 'Horas Extras',
    descripcion: 'Autorizaciones y compensaciones'
  },
  bienvenida: 'Bienvenido al sistema de Recursos Humanos de TECHFORB. Consultá la actividad general y accedé a los módulos desde un solo lugar.',
  indicacionAccesos: 'Ingresá directamente al módulo que necesitás.'
};
