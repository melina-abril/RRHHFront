import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { Employee, EmployeeCreateRequest, EmployeeFilters, EmployeeUpdateRequest } from '../models/employees.models';

let employees: Employee[] = [
  { id: 'e-124', employeeNumber: 'TF-00124', firstName: 'Lucía', lastName: 'Martínez', birthDate: '1992-07-08', residenceCountry: 'Argentina', personalEmail: 'lucia@example.com', startDate: '2021-03-12', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'HYBRID', jobRole: 'Diseñadora de producto', status: 'ACTIVE', initialClient: 'NovaBank', initialProject: 'Portal de clientes', initialManager: 'Diego Fernández', createdById: 'demo-admin', createdAt: '2021-03-12T10:00:00Z', deletedAt: null },
  { id: 'e-131', employeeNumber: 'TF-00131', firstName: 'Martín', lastName: 'Gómez', birthDate: '1995-04-18', residenceCountry: 'México', personalEmail: 'martin@example.com', startDate: '2023-06-01', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'REMOTE', jobRole: 'Desarrollador', status: 'ACTIVE', initialClient: 'Mercado Norte', initialProject: 'Plataforma de ventas', initialManager: null, createdById: 'demo-admin', createdAt: '2023-06-01T10:00:00Z', deletedAt: null },
  { id: 'e-083', employeeNumber: 'TF-00083', firstName: 'Paula', lastName: 'Méndez', birthDate: '1998-11-23', residenceCountry: 'Argentina', personalEmail: 'paula@example.com', startDate: '2022-02-01', category: 'INTERN', dedication: 'PART_TIME', workMode: 'REMOTE', jobRole: 'Analista de datos', status: 'INACTIVE', initialClient: null, initialProject: null, initialManager: null, createdById: 'demo-admin', createdAt: '2022-02-01T10:00:00Z', deletedAt: '2025-08-31T18:00:00Z' },
];

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<Employee>> {
  const query = filters.search.trim().toLocaleLowerCase();
  const items = employees.filter(employee =>
    (!query || `${employee.firstName} ${employee.lastName}`.toLocaleLowerCase().includes(query) || employee.employeeNumber.toLocaleLowerCase().includes(query)) &&
    (!filters.category || employee.category === filters.category) &&
    (!filters.status || employee.status === filters.status) &&
    (!filters.client || (employee.initialClient ?? '').toLocaleLowerCase().includes(filters.client.trim().toLocaleLowerCase())) &&
    (!filters.project || (employee.initialProject ?? '').toLocaleLowerCase().includes(filters.project.trim().toLocaleLowerCase()))
  );
  return mockResponse(toPage(items, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<Employee> {
  const employee = employees.find(item => item.id === id);
  return employee ? mockResponse(employee) : mockError(404, 'No se encontró el colaborador.');
}

export function createEmployeeMock(request: EmployeeCreateRequest): Observable<Employee> {
  if (!request.firstName.trim() || !request.lastName.trim() || !request.personalEmail.includes('@')) return mockError(422, 'Revisa los datos obligatorios.', { personalEmail: ['Ingresa un correo válido.'] });
  if (employees.some(item => item.personalEmail.toLowerCase() === request.personalEmail.toLowerCase())) return mockError(409, 'El correo personal ya está registrado.', { personalEmail: ['El correo ya está en uso.'] });
  const nextNumber = Math.max(0, ...employees.map(item => Number(item.employeeNumber.replace('TF-', '')))) + 1;
  const employee: Employee = { ...request, id: `e-${nextNumber}`, employeeNumber: `TF-${String(nextNumber).padStart(5, '0')}`, initialClient: request.initialClient || null, initialProject: request.initialProject || null, initialManager: request.initialManager || null, status: 'ACTIVE', createdById: 'demo-admin', createdAt: new Date().toISOString(), deletedAt: null };
  employees = [employee, ...employees];
  return mockResponse(employee);
}

export function updateEmployeeMock(id: string, request: EmployeeUpdateRequest): Observable<Employee> {
  const current = employees.find(item => item.id === id);
  if (!current) return mockError(404, 'No se encontró el colaborador.');
  if (!request.firstName.trim() || !request.lastName.trim() || !request.personalEmail.includes('@')) return mockError(422, 'Revisa los datos obligatorios.', { personalEmail: ['Ingresa un correo válido.'] });
  if (employees.some(item => item.id !== id && item.personalEmail.toLowerCase() === request.personalEmail.toLowerCase())) return mockError(409, 'El correo personal ya está registrado.', { personalEmail: ['El correo ya está en uso.'] });
  const updated: Employee = { ...current, ...request };
  employees = employees.map(item => item.id === id ? updated : item);
  return mockResponse(updated);
}
