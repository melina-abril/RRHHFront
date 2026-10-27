// Tipos equivalentes al DTO del backend InicioSummaryResponse

export interface ModuloSummary {
  nombre: string;
  descripcion: string;
}

export interface InicioSummaryResponse {
  totalColaboradores: number;
  solicitudesPendientes: number;
  proximoEvento: string; // Fecha ISO, ej: '2024-07-01'
  gestionEmpleados: ModuloSummary;
  sueldosBonos: ModuloSummary;
  solicitudes: ModuloSummary;
  comunicados: ModuloSummary;
  horasExtras: ModuloSummary;
  bienvenida: string;
  indicacionAccesos: string;
}
