import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { Employee, EmployeeFilters, EmployeeRequest, EmployeeStatus } from '../models/employees.models';

/** Datos mock reales y coherentes con la maqueta y los DTOs. */
let employees: Employee[] = [
  {
    id: 'TFB-0001',
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
    departmentId: 'dev',
    positionId: 'frontend',
    managerId: 'TFB-0002',
    status: 'ACTIVE',
    createdAt: '2021-03-12',
    updatedAt: '2026-02-12',
  },
  {
    id: 'TFB-0002',
    employeeNumber: 'TFB-0002',
    firstName: 'Martín',
    lastName: 'Herrera',
    fullName: 'Martín Herrera',
    documentType: 'DNI',
    documentNumber: '30321456',
    birthDate: '1985-07-18',
    email: 'martin.herrera@gmail.com',
    phone: '+54 11 5555-0021',
    hireDate: '2020-07-08',
    terminationDate: null,
    departmentId: 'dev',
    positionId: 'lead',
    managerId: null,
    status: 'ACTIVE',
    createdAt: '2020-07-08',
    updatedAt: '2026-01-19',
  },
  {
    id: 'TFB-0003',
    employeeNumber: 'TFB-0003',
    firstName: 'Sofía',
    lastName: 'Álvarez',
    fullName: 'Sofía Álvarez',
    documentType: 'DNI',
    documentNumber: '37896653',
    birthDate: '1998-12-10',
    email: 'sofia.alvarez@outlook.com',
    phone: '+54 11 5555-0170',
    hireDate: '2025-02-05',
    terminationDate: null,
    departmentId: 'func',
    positionId: 'analyst',
    managerId: 'TFB-0002',
    status: 'ACTIVE',
    createdAt: '2025-02-05',
    updatedAt: '2026-01-19',
  },
  {
    id: 'TFB-0004',
    employeeNumber: 'TFB-0004',
    firstName: 'Diego',
    lastName: 'Ríos',
    fullName: 'Diego Ríos',
    documentType: 'DNI',
    documentNumber: '31245812',
    birthDate: '1991-09-23',
    email: 'diego.rios@gmail.com',
    phone: '+54 11 5555-0112',
    hireDate: '2022-09-18',
    terminationDate: null,
    departmentId: 'data',
    positionId: 'data-analyst',
    managerId: 'TFB-0002',
    status: 'ACTIVE',
    createdAt: '2022-09-18',
    updatedAt: '2026-01-19',
  },
  {
    id: 'TFB-0005',
    employeeNumber: 'TFB-0005',
    firstName: 'Valentina',
    lastName: 'Costa',
    fullName: 'Valentina Costa',
    documentType: 'DNI',
    documentNumber: '34123157',
    birthDate: '1991-04-15',
    email: 'valentina.costa@gmail.com',
    phone: '+54 11 5555-0907',
    hireDate: '2023-11-21',
    terminationDate: null,
    departmentId: 'dev',
    positionId: 'backend',
    managerId: 'TFB-0002',
    status: 'ACTIVE',
    createdAt: '2023-11-21',
    updatedAt: '2026-02-01',
  },
  {
    id: 'TFB-0006',
    employeeNumber: 'TFB-0006',
    firstName: 'Tomás',
    lastName: 'Medina',
    fullName: 'Tomás Medina',
    documentType: 'DNI',
    documentNumber: '42005937',
    birthDate: '2001-09-30',
    email: 'tomas.medina@gmail.com',
    phone: '+54 11 5555-0926',
    hireDate: '2025-03-03',
    terminationDate: null,
    departmentId: 'qa',
    positionId: 'qa-engineer',
    managerId: 'TFB-0002',
    status: 'ACTIVE',
    createdAt: '2025-03-03',
    updatedAt: '2026-01-19',
  },
  {
    id: 'TFB-0007',
    employeeNumber: 'TFB-0007',
    firstName: 'Camila',
    lastName: 'Suárez',
    fullName: 'Camila Suárez',
    documentType: 'DNI',
    documentNumber: '34789641',
    birthDate: '1995-02-22',
    email: 'camila.suarez@outlook.com',
    phone: '+54 11 5555-0196',
    hireDate: '2019-06-14',
    terminationDate: '2026-01-11',
    departmentId: 'ux',
    positionId: 'ux',
    managerId: 'TFB-0002',
    status: 'TERMINATED',
    createdAt: '2019-06-14',
    updatedAt: '2026-01-11',
  },
  {
    id: 'TFB-0008',
    employeeNumber: 'TFB-0008',
    firstName: 'Nicolás',
    lastName: 'Vega',
    fullName: 'Nicolás Vega',
    documentType: 'DNI',
    documentNumber: '44012957',
    birthDate: '2002-05-15',
    email: 'nicolas.vega@gmail.com',
    phone: '+54 11 5555-0168',
    hireDate: '2024-01-09',
    terminationDate: '2026-01-14',
    departmentId: 'it',
    positionId: 'support',
    managerId: 'TFB-0002',
    status: 'TERMINATED',
    createdAt: '2024-01-09',
    updatedAt: '2026-01-14',
  }
];

function nextEmployeeNumber(): string {
  const numbers = employees.map(e => Number(e.employeeNumber.replace(/^TFB-/, ''))).filter(n => !isNaN(n));
  const max = numbers.length > 0 ? Math.max(...numbers) : 1;
  return `TFB-${(max + 1).toString().padStart(4, '0')}`;
}

const notFound = (id: string): Observable<never> => mockError(404, `No existe el colaborador ${id}.`);

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<Employee>> {
  let filtered = employees;
  const search = filters.search.trim().toLowerCase();
  if (search) {
    filtered = filtered.filter(e =>
      e.fullName.toLowerCase().includes(search) ||
      e.employeeNumber.toLowerCase().includes(search)
    );
  }
  if (filters.status) {
    filtered = filtered.filter(e => e.status === filters.status);
  }
  if (filters.departmentId) {
    filtered = filtered.filter(e => e.departmentId === filters.departmentId);
  }
  if (filters.positionId) {
    filtered = filtered.filter(e => e.positionId === filters.positionId);
  }
  return mockResponse(toPage(filtered, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<Employee> {
  const employee = employees.find(e => e.id === id);
  return employee ? mockResponse(employee) : notFound(id);
}

export function createEmployeeMock(request: EmployeeRequest): Observable<Employee> {
  // Se podría validar duplicados según documento, email, etc.
  const id = nextEmployeeNumber();
  const fullName = `${request.firstName} ${request.lastName}`;
  const now = new Date().toISOString().slice(0, 10);
  const employee: Employee = {
    id,
    employeeNumber: id,
    firstName: request.firstName,
    lastName: request.lastName,
    fullName,
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
    createdAt: now,
    updatedAt: now,
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}

export function updateEmployeeMock(id: string, request: EmployeeRequest): Observable<Employee> {
  const current = employees.find(e => e.id === id);
  if (!current) return notFound(id);
  const fullName = `${request.firstName} ${request.lastName}`;
  const now = new Date().toISOString().slice(0, 10);
  const updated: Employee = {
    ...current,
    ...request,
    fullName,
    updatedAt: now
  };
  employees = employees.map(e => (e.id === id ? updated : e));
  return mockResponse(updated);
}

export function terminateEmployeeMock(id: string): Observable<void> {
  const current = employees.find(e => e.id === id);
  if (!current) return notFound(id);
  if (current.status === 'TERMINATED') {
    return mockError(409, 'El colaborador ya está inactivo.');
  }
  const now = new Date().toISOString().slice(0, 10);
  employees = employees.map(e =>
    e.id === id ? { ...e, status: 'TERMINATED', terminationDate: now, updatedAt: now } : e
  );
  return mockResponse(undefined);
}

export function rejoinEmployeeMock(id: string, hireDate: string): Observable<Employee> {
  const current = employees.find(e => e.id === id);
  if (!current) return notFound(id);
  if (current.status === 'ACTIVE') {
    return mockError(409, 'El colaborador ya está activo.');
  }
  const now = new Date().toISOString().slice(0, 10);
  const updated: Employee = {
    ...current,
    hireDate: hireDate,
    terminationDate: null,
    status: 'ACTIVE',
    updatedAt: now
  };
  employees = employees.map(e => (e.id === id ? updated : e));
  return mockResponse(updated);
}
