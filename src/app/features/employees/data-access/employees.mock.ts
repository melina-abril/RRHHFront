import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { EmployeeRequest, EmployeeResponse } from '../models/employees.models';

let employees: EmployeeResponse[] = [
  {
    id: 'EMP-1001', employeeNumber: 'EMP-1001', firstName: 'Lucía', lastName: 'Fernández',
    birthDate: '1994-04-12', residenceCountry: 'Argentina', personalEmail: 'lucia.fernandez@example.com',
    startDate: '2025-07-01', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'HYBRID',
    jobRole: 'Analista funcional', status: 'ACTIVE', initialClient: 'Banco Andino',
    initialProject: 'Banca digital', initialManager: 'Mariana López', createdAt: '2025-07-01T12:00:00Z',
  },
  {
    id: 'EMP-1002', employeeNumber: 'EMP-1002', firstName: 'Diego', lastName: 'Morales',
    birthDate: '1999-09-03', residenceCountry: 'México', personalEmail: 'diego.morales@example.com',
    startDate: '2026-02-16', category: 'INTERN', dedication: 'PART_TIME', workMode: 'REMOTE',
    jobRole: 'Desarrollador', status: 'ACTIVE', initialClient: null,
    initialProject: null, initialManager: null, createdAt: '2026-02-16T10:00:00Z',
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
    return mockError(422, 'Revisa los datos obligatorios.');
  }
  if (request.birthDate >= request.startDate) {
    return mockError(422, 'La fecha de ingreso debe ser posterior a la fecha de nacimiento.', {
      startDate: ['La fecha de ingreso debe ser posterior a la fecha de nacimiento.'],
    });
  }
  if (employees.some((item) => item.personalEmail.toLowerCase() === request.personalEmail.toLowerCase())) {
    return mockError(409, 'Ya existe un colaborador con este correo.', {
      personalEmail: ['El correo personal ya está en uso.'],
    });
  }
  const employeeNumber = `EMP-${1001 + employees.length}`;
  const employee: EmployeeResponse = {
    ...request, id: employeeNumber, employeeNumber, status: 'ACTIVE', createdAt: new Date().toISOString(),
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}
