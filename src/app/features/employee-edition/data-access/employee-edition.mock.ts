import { UpdateEmployeeRequest, UpdateEmployeeResponse } from '../models/employee-edition.models';
import { EMPLOYEE_PROFILE_MOCK } from '../../employee-profile/data-access/employee-profile.mock';

export function updateEmployeeMock(id: string, req: UpdateEmployeeRequest): UpdateEmployeeResponse {
  // Devuelve la ficha actualizada con algunos campos cambiados, como ejemplo
  return {
    ...EMPLOYEE_PROFILE_MOCK(),
    nombre: req.nombre,
    apellido: req.apellido,
    fechaNacimiento: req.fechaNacimiento,
    paisResidencia: req.paisResidencia,
    correoPersonal: req.correoPersonal,
    dedicacion: req.dedicacion,
    modalidadTrabajo: req.modalidadTrabajo,
    rolLaboral: req.rolLaboral,
    categoria: req.categoria ?? EMPLOYEE_PROFILE_MOCK().categoria,
    // Actualizar el historial de cambios, fecha y responsable (simplificado)
    historial: [
      {
        fecha: new Date().toISOString(),
        responsable: 'Administrador RR.HH',
        campo: 'Edición de datos',
        valores: {
          antiguos: EMPLOYEE_PROFILE_MOCK(),
          nuevos: req
        }
      },
      ...(EMPLOYEE_PROFILE_MOCK().historial ?? [])
    ]
  };
}
