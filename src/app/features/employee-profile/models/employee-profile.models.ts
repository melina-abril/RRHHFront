// DTO igual que EmployeeProfileDto
export interface EmployeeProfile {
  legajo: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO LocalDate
  paisResidencia: string;
  correoPersonal: string;
  fechaIngreso: string; // ISO LocalDate
  categoria: string;
  dedicacion: string;
  modalidadTrabajo: string;
  rolLaboral: string;
  estado: string;
  cliente: string;
  proyecto: string;
  referente: string;
  datosCorporativos: string;
}
