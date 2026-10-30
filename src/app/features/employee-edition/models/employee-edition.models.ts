import { EmployeeProfile } from '../../employee-profile/models/employee-profile.models';

export interface UpdateEmployeeRequest {
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO yyyy-MM-dd
  paisResidencia: string;
  correoPersonal: string;
  dedicacion: string;
  modalidadTrabajo: string;
  rolLaboral: string;
  categoria?: string;
}

// La respuesta es una ficha de colaborador actualizada
export type UpdateEmployeeResponse = EmployeeProfile;
