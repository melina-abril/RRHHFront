import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { Employee, EmployeeFilters, EmployeeRequest } from '../models/employee-management.models';

let employees: Employee[] = [
  { id: 'EMP-1001', employeeNumber: 'EMP-1001', firstName: 'Lucía', lastName: 'Fernández', birthDate: '1995-04-12', residenceCountry: 'Argentina', personalEmail: 'lucia.fernandez@example.com', hireDate: '2026-07-01', category: 'PERMANENT', commitment: 'FULL_TIME', workMode: 'HYBRID', jobRole: 'Analista funcional', clientName: 'Banco Andino', projectName: 'Banca digital', contactName: 'Mariana López', status: 'ACTIVE', createdAt: '2026-07-01T12:00:00.000Z' },
  { id: 'EMP-1002', employeeNumber: 'EMP-1002', firstName: 'Mateo', lastName: 'García', birthDate: '2001-08-23', residenceCountry: 'México', personalEmail: 'mateo.garcia@example.com', hireDate: '2026-02-15', category: 'INTERN', commitment: 'PART_TIME', workMode: 'REMOTE', jobRole: 'Desarrollador', clientName: null, projectName: null, contactName: null, status: 'ACTIVE', createdAt: '2026-02-15T12:00:00.000Z' },
  { id: 'EMP-1003', employeeNumber: 'EMP-1003', firstName: 'Sofía', lastName: 'Ríos', birthDate: '1992-11-05', residenceCountry: 'Argentina', personalEmail: 'sofia.rios@example.com', hireDate: '2024-03-04', category: 'PERMANENT', commitment: 'FULL_TIME', workMode: 'ON_SITE', jobRole: 'Diseñadora UX', clientName: 'Banco Andino', projectName: 'Banca digital', contactName: null, status: 'INACTIVE', createdAt: '2024-03-04T12:00:00.000Z' },
];

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<Employee>> {
  const search = normalize(filters.search);
  const matching = employees.filter((employee) => !search || normalize(`${employee.firstName} ${employee.lastName}`).startsWith(search) || normalize(employee.firstName).startsWith(search) || normalize(employee.lastName).startsWith(search));
  return mockResponse(toPage(matching, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<Employee> {
  const employee = employees.find((item) => item.id === id || item.employeeNumber === id);
  return employee ? mockResponse(employee) : mockError(404, 'No se encontró el colaborador.');
}

export function createEmployeeMock(request: EmployeeRequest): Observable<Employee> {
  const required: (keyof EmployeeRequest)[] = ['firstName', 'lastName', 'birthDate', 'residenceCountry', 'personalEmail', 'hireDate', 'category', 'commitment', 'workMode', 'jobRole'];
  const missing = required.find((field) => !request[field]?.trim());
  if (missing) return mockError(422, 'Completa los campos obligatorios.', { [missing]: ['Este campo es obligatorio.'] });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.personalEmail)) return mockError(422, 'Revisa el correo personal.', { personalEmail: ['Ingresa un correo electrónico válido.'] });
  if (employees.some((employee) => normalize(employee.personalEmail) === normalize(request.personalEmail))) {
    return mockError(409, 'Ya existe un colaborador con este correo.', { personalEmail: ['El correo ya está registrado.'] });
  }
  const nextNumber = Math.max(1000, ...employees.map((employee) => Number(employee.employeeNumber.replace('EMP-', '')))) + 1;
  const employeeNumber = `EMP-${nextNumber}`;
  const employee: Employee = { ...request, id: employeeNumber, employeeNumber, status: 'ACTIVE', createdAt: new Date().toISOString() };
  employees = [employee, ...employees];
  return mockResponse(employee);
}
