import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { Employee, EmployeeFilters, EmployeeRequest, EmployeeStatus } from '../models/employees.models';

let employees: Employee[] = [
  {
    id: 'emp-1001',
    employeeNumber: 'TFB-0001',
    firstName: 'Lucía',
    lastName: 'Fernández',
    fullName: 'Lucía Fernández',
    documentType: 'DNI',
    documentNumber: '32456789',
    birthDate: '1987-03-21',
    email: 'lucia.fernandez@gmail.com',
    phone: '+54 11 5555-0168',
    hireDate: '2021-03-12',
    terminationDate: null,
    departmentId: 'dept-tech',
    positionId: 'dev-frontend',
    managerId: 'emp-1040',
    status: 'ACTIVE',
    createdAt: '2021-03-10T09:10:00Z',
    updatedAt: '2021-07-20T09:10:00Z',
  },
  {
    id: 'emp-1002',
    employeeNumber: 'TFB-0002',
    firstName: 'Martín',
    lastName: 'Herrera',
    fullName: 'Martín Herrera',
    documentType: 'DNI',
    documentNumber: '25609123',
    birthDate: '1990-11-05',
    email: 'martin.herrera@gmail.com',
    phone: '+54 9 11 5509-0001',
    hireDate: '2020-07-08',
    terminationDate: null,
    departmentId: 'dept-tech',
    positionId: 'lead-tech',
    managerId: null,
    status: 'ACTIVE',
    createdAt: '2020-07-06T11:00:00Z',
    updatedAt: '2020-10-08T09:10:00Z',
  },
  {
    id: 'emp-1003',
    employeeNumber: 'TFB-0003',
    firstName: 'Sofía',
    lastName: 'Álvarez',
    fullName: 'Sofía Álvarez',
    documentType: 'DNI',
    documentNumber: '40311222',
    birthDate: '1997-05-12',
    email: 'sofia.alvarez@gmail.com',
    phone: '+54 11 5555-0877',
    hireDate: '2025-02-05',
    terminationDate: null,
    departmentId: 'dept-ops',
    positionId: 'analyst-func',
    managerId: null,
    status: 'ACTIVE',
    createdAt: '2025-02-01T12:00:00Z',
    updatedAt: null,
  },
  {
    id: 'emp-1004',
    employeeNumber: 'TFB-0004',
    firstName: 'Camila',
    lastName: 'Suárez',
    fullName: 'Camila Suárez',
    documentType: 'DNI',
    documentNumber: '35315001',
    birthDate: '1989-07-31',
    email: 'camila.suarez@gmail.com',
    phone: '+54 11 5555-0255',
    hireDate: '2019-06-14',
    terminationDate: '2025-03-12',
    departmentId: 'dept-design',
    positionId: 'ux-designer',
    managerId: 'emp-1002',
    status: 'TERMINATED',
    createdAt: '2019-06-10T13:10:00Z',
    updatedAt: '2025-03-12T14:00:00Z',
  }
];

function notFound(id: string): Observable<never> {
  return mockError(404, `No existe el colaborador ${id}.`);
}

function nextEmployeeNumber(): string {
  // Generar legajo correlativo TFB-000X.
  const numbers = employees.map(e => parseInt(e.employeeNumber.replace(/^TFB-0*/, '')) || 0);
  const nextN = Math.max(0, ...numbers) + 1;
  return `TFB-${String(nextN).padStart(4, '0')}`;
}

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<Employee>> {
  let filtered = employees;
  if (filters.search) {
    const text = filters.search.toLowerCase();
    filtered = filtered.filter(e =>
      e.fullName.toLowerCase().includes(text) ||
      e.employeeNumber.toLowerCase().includes(text)
    );
  }
  if (filters.status) {
    filtered = filtered.filter(e => e.status === filters.status);
  }
  // departmentId y positionId: en los mocks no hay departamentos reales, solo filtra si están completos.
  if (filters.departmentId) {
    filtered = filtered.filter(e => e.departmentId === filters.departmentId);
  }
  if (filters.positionId) {
    filtered = filtered.filter(e => e.positionId === filters.positionId);
  }
  return mockResponse(toPage(filtered, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<Employee> {
  const found = employees.find(e => e.id === id);
  return found ? mockResponse(found) : notFound(id);
}

export function createEmployeeMock(request: EmployeeRequest): Observable<Employee> {
  // Validaciones de ejemplo.
  if (!request.firstName.trim() || !request.lastName.trim()) {
    return mockError(422, 'Faltan completar campos obligatorios.', {
      firstName: ['El nombre es obligatorio.'],
      lastName: ['El apellido es obligatorio.']
    });
  }
  if (employees.some(e => e.documentType === request.documentType && e.documentNumber === request.documentNumber)) {
    return mockError(409, 'El número de documento ya está en uso.', { documentNumber: ['El documento ya está registrado.'] });
  }
  const id = `emp-${Date.now()}`;
  const employee: Employee = {
    id,
    employeeNumber: nextEmployeeNumber(),
    firstName: request.firstName,
    lastName: request.lastName,
    fullName: `${request.firstName} ${request.lastName}`,
    documentType: request.documentType,
    documentNumber: request.documentNumber,
    birthDate: request.birthDate,
    email: request.email,
    phone: request.phone,
    hireDate: request.hireDate,
    terminationDate: null,
    departmentId: request.departmentId,
    positionId: request.positionId,
    managerId: request.managerId,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}

export function updateEmployeeMock(id: string, request: EmployeeRequest): Observable<Employee> {
  const idx = employees.findIndex(e => e.id === id);
  if (idx < 0) return notFound(id);
  if (employees.some(e => e.id !== id && e.documentType === request.documentType && e.documentNumber === request.documentNumber)) {
    return mockError(409, 'El número de documento ya está en uso.', { documentNumber: ['El documento ya está registrado.'] });
  }
  const current = employees[idx];
  const updated: Employee = {
    ...current,
    ...request,
    fullName: `${request.firstName} ${request.lastName}`,
    updatedAt: new Date().toISOString(),
  };
  employees = [...employees.slice(0, idx), updated, ...employees.slice(idx + 1)];
  return mockResponse(updated);
}

export function terminateEmployeeMock(id: string): Observable<void> {
  const idx = employees.findIndex(e => e.id === id);
  if (idx < 0) return notFound(id);
  const current = employees[idx];
  if (current.status === 'TERMINATED') return mockError(422, 'El colaborador ya está inactivo.');
  employees[idx] = {
    ...current,
    status: 'TERMINATED',
    terminationDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(undefined);
}

export function rejoinEmployeeMock(id: string, hireDate: string): Observable<Employee> {
  const idx = employees.findIndex(e => e.id === id);
  if (idx < 0) return notFound(id);
  const current = employees[idx];
  if (current.status === 'ACTIVE') return mockError(422, 'El colaborador ya se encuentra activo.');
  const updated: Employee = {
    ...current,
    hireDate,
    status: 'ACTIVE',
    terminationDate: null,
    updatedAt: new Date().toISOString(),
  };
  employees[idx] = updated;
  return mockResponse(updated);
}
