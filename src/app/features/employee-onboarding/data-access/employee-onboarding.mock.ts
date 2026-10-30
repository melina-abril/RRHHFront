import { EmployeeOnboardingRequest, EmployeeDto } from '../models/employee-onboarding.models';
import { mockResponse } from 'src/app/core/http/mock-response';
import { Observable, throwError } from 'rxjs';

export const MOCK_EMPLOYEE_ONBOARDING = {
  createEmployee: (request: EmployeeOnboardingRequest): Observable<EmployeeDto> => {
    // Respuesta dummy: ficha resultante (con valores inventados y coherentes con la entrada, legajo generado automáticamente)
    if (request.nombre && request.apellido && request.fechaNacimiento && request.paisResidencia && request.correoPersonal && request.fechaIngreso && request.categoria && request.dedicacion && request.modalidadTrabajo && request.rolLaboral) {
      return mockResponse({
        legajo: Math.floor(Math.random() * 8000 + 1000).toString(),
        nombre: request.nombre,
        apellido: request.apellido,
        fechaNacimiento: request.fechaNacimiento,
        paisResidencia: request.paisResidencia,
        correoPersonal: request.correoPersonal,
        estado: 'Activo',
        fechaIngreso: request.fechaIngreso,
        categoria: request.categoria,
        dedicacion: request.dedicacion,
        modalidadTrabajo: request.modalidadTrabajo,
        rolLaboral: request.rolLaboral,
        cliente: request.cliente ?? null,
        proyecto: request.proyecto ?? null,
        referente: request.referente ?? null,
        datosCorporativos: request.datosCorporativos ?? null
      });
    } else {
      return throwError(() => ({
        message: 'Por favor completá todos los campos obligatorios marcados con *.'
      }));
    }
  }
};
