import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { EmployeeListQuery, EmployeeRequest, EmployeeResponse } from '../models/employee-management.models';

let employees: EmployeeResponse[] = [
  {
    id: 'EMP-0001', employeeNumber: 'EMP-0001', firstName: 'Lucía', lastName: 'Morales',
    birthDate: '1993-05-14', residenceCountry: 'Argentina', personalEmail: 'lucia.morales@example.com',
    hireDate: '2024-02-12', category: 'PERMANENT', commitment: 'FULL_TIME', workMode: 'HYBRID',
    jobRole: 'Desarrolladora', clientName: 'Mercado Libre', projectName: 'Plataforma', contactName: 'Marina López',
    status: 'ACTIVE', createdAt: '2024-02-12T12:00:00.000Z',
  },
  {
    id: 'EMP-0002', employeeNumber: 'EMP-0002', firstName: 'Diego', lastName: 'Santos',
    birthDate: '1998-10-08', residenceCountry: 'México', personalEmail: 'diego.santos@example.com',
    hireDate: '2025-06-03', category: 'INTERN', commitment: 'PART_TIME', workMode: 'REMOTE',
    jobRole: 'Analista de datos', clientName: null, projectName: null, contactName: null,
    status: 'ACTIVE', createdAt: '2025-06-03T12:00:00.000Z',
  },
];

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function listEmployeesMock(query: EmployeeListQuery): Observable<Page<EmployeeResponse>> {
  const search = normalize(query.search);
  const matches = employees.filter((employee) =>
    !search || normalize(`${employee.firstName} ${employee.lastName}`).startsWith(search)
    || normalize(employee.firstName).startsWith(search) || normalize(employee.lastName).startsWith(search),
  );
  return mockResponse(toPage(matches, query.page, query.size));
}

export function getEmployeeMock(id: string): Observable<EmployeeResponse> {
  const employee = employees.find((item) => item.id === id || item.employeeNumber === id);
  return employee ? mockResponse(employee) : mockError(404, 'No se encontró el colaborador.');
}

export function createEmployeeMock(request: EmployeeRequest): Observable<EmployeeResponse> {
  if (employees.some((item) => normalize(item.personalEmail) === normalize(request.personalEmail))) {
    return mockError(409, 'Ya existe un colaborador con ese correo.', {
      personalEmail: ['El correo personal ya está registrado.'],
    });
  }
  if (!request.firstName.trim() || !request.lastName.trim() || !request.jobRole.trim()) {
    return mockError(422, 'Revisa los campos obligatorios.');
  }
  const number = `EMP-${String(Math.max(0, ...employees.map((item) => Number(item.employeeNumber.replace('EMP-', '')))) + 1).padStart(4, '0')}`;
  const employee: EmployeeResponse = {
    ...request, id: number, employeeNumber: number, status: 'ACTIVE', createdAt: new Date().toISOString(),
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}
