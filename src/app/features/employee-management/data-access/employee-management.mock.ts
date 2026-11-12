import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { Employee, EmployeeFilters, EmployeeRequest } from '../models/employee-management.models';

let employees: Employee[] = [
  {
    id: 'emp-1001', employeeNumber: 'TF-0001', firstName: 'Lucía', lastName: 'Fernández',
    birthDate: '1995-04-12', residenceCountry: 'Argentina', personalEmail: 'lucia.fernandez@example.com',
    hireDate: '2024-07-01', category: 'PERMANENT', commitment: 'FULL_TIME', workMode: 'HYBRID',
    jobRole: 'Analista funcional', clientName: 'Banco Andino', projectName: 'Banca digital',
    contactName: 'Mariana López', status: 'ACTIVE', createdAt: '2024-07-01T12:00:00.000Z',
  },
  {
    id: 'emp-1002', employeeNumber: 'TF-0002', firstName: 'Mateo', lastName: 'García',
    birthDate: '2001-09-18', residenceCountry: 'México', personalEmail: 'mateo.garcia@example.com',
    hireDate: '2025-03-10', category: 'INTERN', commitment: 'PART_TIME', workMode: 'REMOTE',
    jobRole: 'Desarrollador', clientName: null, projectName: null, contactName: null,
    status: 'ACTIVE', createdAt: '2025-03-10T12:00:00.000Z',
  },
];

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<Employee>> {
  const search = filters.search.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const matches = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().startsWith(search),
  );
  return mockResponse(toPage(matches, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<Employee> {
  const employee = employees.find((item) => item.id === id || item.employeeNumber === id);
  return employee ? mockResponse(employee) : mockError(404, 'No se encontró el colaborador.');
}

export function createEmployeeMock(request: EmployeeRequest): Observable<Employee> {
  if (employees.some((item) => item.personalEmail.toLowerCase() === request.personalEmail.toLowerCase())) {
    return mockError(409, 'Ya existe un colaborador con ese correo.', { personalEmail: ['El correo ya está registrado.'] });
  }
  if (!request.firstName.trim() || !request.lastName.trim() || !request.jobRole.trim()) {
    return mockError(422, 'Revisa los datos obligatorios.');
  }
  const nextNumber = Math.max(0, ...employees.map((item) => Number(item.employeeNumber.replace('TF-', '')))) + 1;
  const employee: Employee = {
    ...request,
    id: `emp-${1000 + nextNumber}`,
    employeeNumber: `TF-${String(nextNumber).padStart(4, '0')}`,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}
