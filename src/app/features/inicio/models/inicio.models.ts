export interface InicioSummaryResponse {
  totalColaboradores: number;
  solicitudesPendientes: number;
  proximoEvento: string;
  gestionEmpleados: ModuloSummary;
  sueldosBonos: ModuloSummary;
  solicitudes: ModuloSummary;
  comunicados: ModuloSummary;
  horasExtras: ModuloSummary;
  bienvenida: string;
  indicacionAccesos: string;
}

export interface ModuloSummary {
  nombre: string;
  descripcion: string;
}
