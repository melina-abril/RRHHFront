import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { EmployeeListQuery, EmployeeRequest, EmployeeResponse } from '../models/employee-management.models';

let employees: EmployeeResponse[] = [
  {
    id: 'emp-1001', employeeNumber: 'TF-1001', firstName: 'Lucía', lastName: 'Morales',
    birthDate: '1994-05-16', residenceCountry: 'Argentina', personalEmail: 'lucia.morales@example.com',
    hireDate: '2024-03-11', category: 'PERMANENT', commitment: 'FULL_TIME', workMode: 'HYBRID',
    jobRole: 'Desarrolladora', clientName: 'Mercado Libre', projectName: 'Plataforma de pagos',
    contactName: 'María González', status: 'ACTIVE', createdAt: '2024-03-11T14:30:00Z',
  },
  {
    id: 'emp-1002', employeeNumber: 'TF-1002', firstName: 'Diego', lastName: 'Ramírez',
    birthDate: '2001-09-07', residenceCountry: 'México', personalEmail: 'diego.ramirez@example.com',
    hireDate: '2025-02-03', category: 'INTERN', commitment: 'PART_TIME', workMode: 'REMOTE',
    jobRole: 'Analista de datos', clientName: null, projectName: null,
    contactName: null, status: 'ACTIVE', createdAt: '2025-02-03T09:00:00Z',
  },
];

function normalized(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function listEmployeesMock(query: EmployeeListQuery): Observable<Page<EmployeeResponse>> {
  const search = normalized(query.search);
  const matches = employees.filter((employee) =>
    !search || normalized(`${employee.firstName} ${employee.lastName}`).startsWith(search),
  );
  return mockResponse(toPage(matches, query.page, query.size));
}

export function getEmployeeMock(id: string): Observable<EmployeeResponse> {
  const employee = employees.find((item) => item.id === id);
  return employee ? mockResponse(employee) : mockError(404, 'No se encontró el colaborador.');
}

export function createEmployeeMock(request: EmployeeRequest): Observable<EmployeeResponse> {
  if (employees.some((item) => item.personalEmail.toLowerCase() === request.personalEmail.toLowerCase())) {
    return mockError(409, 'Ya existe un colaborador con este correo.', {
      personalEmail: ['El correo personal ya está registrado.'],
    });
  }
  if (!request.firstName.trim() || !request.lastName.trim() || !request.jobRole.trim()) {
    return mockError(422, 'Revisa los campos obligatorios.');
  }
  const nextNumber = Math.max(1000, ...employees.map((item) => Number(item.employeeNumber.replace('TF-', '')))) + 1;
  const employee: EmployeeResponse = {
    ...request,
    id: `emp-${nextNumber}`,
    employeeNumber: `TF-${nextNumber}`,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}
