import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { EmployeeFilters, EmployeeResponse, UpdateEmployeeRequest } from '../models/employees-2.models';

let employees: EmployeeResponse[] = [
  { id: 'emp-124', employeeNumber: 'TF-00124', firstName: 'Lucía', lastName: 'Martínez', birthDate: '1992-08-18', residenceCountry: 'Argentina', personalEmail: 'lucia.martinez@example.com', startDate: '2022-05-10', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'HYBRID', jobRole: 'Diseñadora', status: 'ACTIVE', initialClient: 'NovaBank', initialProject: 'Portal de clientes', initialManager: 'Coordinación', createdById: 'admin-demo', createdAt: '2022-05-10T12:00:00Z', deletedAt: null },
  { id: 'emp-131', employeeNumber: 'TF-00131', firstName: 'Martín', lastName: 'Gómez', birthDate: '1995-03-11', residenceCountry: 'México', personalEmail: 'martin.gomez@example.com', startDate: '2023-02-01', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'REMOTE', jobRole: 'Desarrollador', status: 'ACTIVE', initialClient: 'Mercado Norte', initialProject: 'Plataforma de ventas', initialManager: 'Coordinación', createdById: 'admin-demo', createdAt: '2023-02-01T12:00:00Z', deletedAt: null },
  { id: 'emp-148', employeeNumber: 'TF-00148', firstName: 'Camila', lastName: 'Torres', birthDate: '1998-09-09', residenceCountry: 'Argentina', personalEmail: 'camila.torres@example.com', startDate: '2024-01-15', category: 'INTERN', dedication: 'PART_TIME', workMode: 'HYBRID', jobRole: 'Analista de producto', status: 'ACTIVE', initialClient: 'Clínica Solís', initialProject: 'Historia clínica', initialManager: 'Coordinación', createdById: 'admin-demo', createdAt: '2024-01-15T12:00:00Z', deletedAt: null },
  { id: 'emp-083', employeeNumber: 'TF-00083', firstName: 'Paula', lastName: 'Méndez', birthDate: '1990-04-22', residenceCountry: 'Argentina', personalEmail: 'paula.mendez@example.com', startDate: '2020-06-01', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'ONSITE', jobRole: 'Analista de datos', status: 'INACTIVE', initialClient: null, initialProject: null, initialManager: null, createdById: 'admin-demo', createdAt: '2020-06-01T12:00:00Z', deletedAt: '2025-08-31T12:00:00Z' },
];

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<EmployeeResponse>> {
  const search = filters.search.trim().toLocaleLowerCase();
  const client = filters.client.trim().toLocaleLowerCase();
  const project = filters.project.trim().toLocaleLowerCase();
  const matches = employees.filter((employee) =>
    (!search || `${employee.firstName} ${employee.lastName}`.toLocaleLowerCase().includes(search) || employee.employeeNumber.toLocaleLowerCase().includes(search)) &&
    (!filters.category || employee.category === filters.category) &&
    (!client || (employee.initialClient ?? '').toLocaleLowerCase().includes(client)) &&
    (!project || (employee.initialProject ?? '').toLocaleLowerCase().includes(project)) &&
    (!filters.status || employee.status === filters.status),
  );
  return mockResponse(toPage(matches, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<EmployeeResponse> {
  const employee = employees.find((item) => item.id === id);
  return employee ? mockResponse(employee) : mockError(404, 'No se encontró el colaborador.');
}

export function updateEmployeeMock(id: string, request: UpdateEmployeeRequest): Observable<EmployeeResponse> {
  const employee = employees.find((item) => item.id === id);
  if (!employee) return mockError(404, 'No se encontró el colaborador.');
  if (!request.firstName.trim() || !request.lastName.trim() || !request.residenceCountry.trim() || !request.jobRole.trim()) {
    return mockError(422, 'Revisa los campos obligatorios.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.personalEmail)) {
    return mockError(422, 'Ingresa un correo personal válido.', { personalEmail: ['Ingresa un correo personal válido.'] });
  }
  const updated: EmployeeResponse = { ...employee, ...request };
  employees = employees.map((item) => item.id === id ? updated : item);
  return mockResponse(updated);
}
