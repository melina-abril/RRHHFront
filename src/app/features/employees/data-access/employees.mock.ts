import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { EmployeeRequest, EmployeeResponse } from '../models/employees.models';

let employees: EmployeeResponse[] = [
  {
    id: 'emp-1001', employeeNumber: 'TF-1001', firstName: 'Lucía', lastName: 'Fernández',
    birthDate: '1994-03-18', residenceCountry: 'Argentina', personalEmail: 'lucia.fernandez@example.com',
    startDate: '2024-07-01', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'HYBRID',
    jobRole: 'Analista funcional', status: 'ACTIVE', initialClient: 'Banco Andino',
    initialProject: 'Banca digital', initialManager: 'Mariana López', createdAt: '2024-07-01T10:00:00Z',
  },
  {
    id: 'emp-1002', employeeNumber: 'TF-1002', firstName: 'Mateo', lastName: 'Gómez',
    birthDate: '1998-11-04', residenceCountry: 'México', personalEmail: 'mateo.gomez@example.com',
    startDate: '2025-02-10', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'REMOTE',
    jobRole: 'Desarrollador', status: 'ACTIVE', initialClient: null, initialProject: null,
    initialManager: null, createdAt: '2025-02-10T09:00:00Z',
  },
  {
    id: 'emp-1003', employeeNumber: 'TF-1003', firstName: 'Sofía', lastName: 'Pérez',
    birthDate: '2002-06-22', residenceCountry: 'Argentina', personalEmail: 'sofia.perez@example.com',
    startDate: '2025-09-01', category: 'INTERN', dedication: 'PART_TIME', workMode: 'ONSITE',
    jobRole: 'Asistente de operaciones', status: 'INACTIVE', initialClient: null, initialProject: null,
    initialManager: null, createdAt: '2025-09-01T09:00:00Z',
  },
];

export function listEmployeesMock(page: number, size: number): Observable<Page<EmployeeResponse>> {
  return mockResponse(toPage(employees, page, size));
}

export function getEmployeeMock(id: string): Observable<EmployeeResponse> {
  const employee = employees.find((item) => item.id === id || item.employeeNumber === id);
  return employee ? mockResponse(employee) : mockError(404, 'No se encontró el colaborador.');
}

export function createEmployeeMock(request: EmployeeRequest): Observable<EmployeeResponse> {
  const required = ['firstName', 'lastName', 'birthDate', 'residenceCountry', 'personalEmail', 'startDate', 'jobRole'] as const;
  const missing = required.find((field) => !request[field].trim());
  if (missing) return mockError(422, 'Revisa los datos obligatorios.', { [missing]: ['Este campo es obligatorio.'] });
  if (request.birthDate >= request.startDate) {
    return mockError(422, 'Revisa las fechas.', { startDate: ['La fecha de ingreso debe ser posterior a la fecha de nacimiento.'] });
  }
  if (employees.some((item) => item.personalEmail.toLowerCase() === request.personalEmail.toLowerCase())) {
    return mockError(409, 'Ya existe un colaborador con ese correo personal.', { personalEmail: ['El correo personal ya está en uso.'] });
  }
  const nextNumber = Math.max(1000, ...employees.map((item) => Number(item.employeeNumber.replace('TF-', '')))) + 1;
  const employee: EmployeeResponse = {
    ...request,
    personalEmail: request.personalEmail.trim().toLowerCase(),
    id: `emp-${nextNumber}`,
    employeeNumber: `TF-${nextNumber}`,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}
