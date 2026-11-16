import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { EmployeeRequest, EmployeeResponse } from '../models/employees.models';

let employees: EmployeeResponse[] = [
  {
    id: '1001', employeeNumber: '1001', firstName: 'Lucía', lastName: 'Fernández',
    birthDate: '1994-05-18', residenceCountry: 'Argentina', personalEmail: 'lucia.fernandez@example.com',
    startDate: '2026-07-01', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'HYBRID',
    jobRole: 'Analista funcional', status: 'ACTIVE', initialClient: 'Banco Andino',
    initialProject: 'Banca digital', initialManager: 'Mariana López', createdAt: '2026-07-01T09:00:00Z',
  },
  {
    id: '1002', employeeNumber: '1002', firstName: 'Diego', lastName: 'Morales',
    birthDate: '1998-03-12', residenceCountry: 'México', personalEmail: 'diego.morales@example.com',
    startDate: '2026-08-15', category: 'INTERN', dedication: 'PART_TIME', workMode: 'REMOTE',
    jobRole: 'Desarrollador', status: 'ACTIVE', initialClient: null,
    initialProject: null, initialManager: null, createdAt: '2026-08-15T09:00:00Z',
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
  if (!request.firstName.trim() || !request.lastName.trim() || !request.jobRole.trim()) {
    return mockError(422, 'Completa los datos obligatorios.');
  }
  if (request.birthDate >= request.startDate) {
    return mockError(422, 'Revisa las fechas.', { startDate: ['La fecha de ingreso debe ser posterior a la fecha de nacimiento.'] });
  }
  if (employees.some((employee) => employee.personalEmail.toLowerCase() === request.personalEmail.trim().toLowerCase())) {
    return mockError(409, 'Ya existe un colaborador con ese correo personal.', {
      personalEmail: ['El correo personal ya está en uso.'],
    });
  }
  const employeeNumber = String(Math.max(1000, ...employees.map((employee) => Number(employee.employeeNumber))) + 1);
  const employee: EmployeeResponse = {
    ...request,
    personalEmail: request.personalEmail.trim().toLowerCase(),
    id: employeeNumber,
    employeeNumber,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}
