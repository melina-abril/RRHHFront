/**
 * DTO de alta de colaborador (según contrato backend - CreateEmployeeRequest)
 */
export interface EmployeeOnboardingRequest {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO date
  paisResidencia: string;
  correoPersonal: string;
  fechaIngreso: string; // ISO date
  categoria: string;
  dedicacion: string;
  modalidadTrabajo: string;
  rolLaboral: string;
  cliente?: string | null;
  proyecto?: string | null;
  referente?: string | null;
  datosCorporativos?: string | null;
}

/**
 * DTO de resultado del alta (EmployeeDto minimal para la ficha)
 */
export interface EmployeeDto {
  legajo: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  paisResidencia: string;
  correoPersonal: string;
  estado: string; // 'Activo' (por defecto)
  fechaIngreso: string;
  categoria: string;
  dedicacion: string;
  modalidadTrabajo: string;
  rolLaboral: string;
  cliente?: string | null;
  proyecto?: string | null;
  referente?: string | null;
  datosCorporativos?: string | null;
}
