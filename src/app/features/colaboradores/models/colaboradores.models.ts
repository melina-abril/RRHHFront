export type EstadoColaborador = 'ACTIVO' | 'EGRESADO';

export interface FiltroColaboradores {
  busqueda?: string;
  categoria?: string;
  cliente?: string;
  proyecto?: string;
  estado?: string;
}

export interface ColaboradorResumen {
  id: number;
  legajo: string;
  nombreCompleto: string;
  categoria: string;
  cliente: string;
  proyecto: string;
  estado: EstadoColaborador;
}

export interface MovResumen {
  cliente: string;
  proyecto: string;
  rol: string;
  inicio: string; // ISO Date
  fin: string | null; // ISO Date | null
}

export interface ColaboradorFicha {
  id: number;
  legajo: string;
  nombre: string;
  apellido: string;
  documentoTipo: string;
  documentoNumero: string;
  paisResidencia: string;
  fechaNacimiento: string; // ISO Date
  correoPersonal: string;
  fechaIngreso: string; // ISO Date
  categoria: string;
  dedicacion: string;
  modalidadTrabajo: string;
  rolLaboral: string;
  emailCorporativo?: string;
  estado: EstadoColaborador;
  asignaciones: MovResumen[];
  beneficios: string[];
  documentos: string[];
  evaluaciones: string[];
  bitacora: string[];
  remuneraciones: string[];
  bonos: string[];
}

export interface CrearColaboradorRequest {
  nombre: string;
  apellido: string;
  documentoTipo: string;
  documentoNumero: string;
  paisResidencia: string;
  fechaNacimiento: string; // ISO Date
  correoPersonal: string;
  fechaIngreso: string; // ISO Date
  categoria: string;
  dedicacion: string;
  modalidadTrabajo: string;
  rolLaboral: string;
  emailCorporativo?: string;
}

export interface EditarColaboradorRequest {
  nombre: string;
  apellido: string;
  documentoTipo: string;
  documentoNumero: string;
  paisResidencia: string;
  fechaNacimiento: string;
  correoPersonal: string;
  categoria: string;
  dedicacion: string;
  modalidadTrabajo: string;
  rolLaboral: string;
  emailCorporativo?: string;
}
