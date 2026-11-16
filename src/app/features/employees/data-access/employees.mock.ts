import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { Employee, EmployeeFilters, EmployeeRequest } from '../models/employees.models';

/** Datos de demostración en memoria; las altas persisten hasta recargar la aplicación. */
let employees: Employee[] = [
  {
    id: 'employee-1', employeeNumber: 'TF-0001', firstName: 'Lucía', lastName: 'Fernández',
    birthDate: '1993-04-18', residenceCountry: 'Argentina', personalEmail: 'lucia.fernandez@example.com',
    startDate: '2025-07-01', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'HYBRID',
    jobRole: 'Analista funcional', status: 'ACTIVE', initialClient: 'Banco Andino',
    initialProject: 'Banca digital', initialManager: 'Mariana López',
    createdById: 'demo-admin', createdAt: '2025-07-01T12:00:00Z', deletedAt: null,
  },
  {
    id: 'employee-2', employeeNumber: 'TF-0002', firstName: 'Mateo', lastName: 'Ríos',
    birthDate: '1998-09-12', residenceCountry: 'México', personalEmail: 'mateo.rios@example.com',
    startDate: '2026-03-15', category: 'INTERN', dedication: 'PART_TIME', workMode: 'REMOTE',
    jobRole: 'Desarrollador', status: 'ACTIVE', initialClient: null, initialProject: null,
    initialManager: null, createdById: 'demo-admin', createdAt: '2026-03-15T12:00:00Z', deletedAt: null,
  },
];

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<Employee>> {
  const search = filters.search.trim().toLowerCase();
  const matching = employees.filter((employee) =>
    (!search || `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(search) ||
      employee.employeeNumber.toLowerCase().includes(search)) &&
    (!filters.status || employee.status === filters.status) &&
    (!filters.category || employee.category === filters.category),
  );
  return mockResponse(toPage(matching, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<Employee> {
  const employee = employees.find((item) => item.id === id);
  return employee ? mockResponse(employee) : mockError(404, 'No se encontró el colaborador.');
}

export function createEmployeeMock(request: EmployeeRequest): Observable<Employee> {
  if (employees.some((item) => item.personalEmail.toLowerCase() === request.personalEmail.trim().toLowerCase())) {
    return mockError(409, 'Ya existe un colaborador con ese correo personal.', {
      personalEmail: ['El correo personal ya está registrado.'],
    });
  }
  const required = [request.firstName, request.lastName, request.birthDate, request.residenceCountry,
    request.personalEmail, request.startDate, request.jobRole];
  if (required.some((value) => !value.trim())) {
    return mockError(422, 'Revisa los datos obligatorios antes de guardar.');
  }
  const nextNumber = Math.max(0, ...employees.map((item) => Number(item.employeeNumber.replace('TF-', '')))) + 1;
  const employee: Employee = {
    ...request,
    id: `employee-${nextNumber}`,
    employeeNumber: `TF-${String(nextNumber).padStart(4, '0')}`,
    firstName: request.firstName.trim(),
    lastName: request.lastName.trim(),
    residenceCountry: request.residenceCountry.trim(),
    personalEmail: request.personalEmail.trim().toLowerCase(),
    jobRole: request.jobRole.trim(),
    initialClient: request.initialClient?.trim() || null,
    initialProject: request.initialProject?.trim() || null,
    initialManager: request.initialManager?.trim() || null,
    status: 'ACTIVE',
    createdById: 'demo-admin',
    createdAt: new Date().toISOString(),
    deletedAt: null,
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}
