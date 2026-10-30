import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { Employee, EmployeeFilters, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeCategory, EmployeeWorkMode, EmployeeDedication, EmployeeState } from '../models/employees.models';

let employees: Employee[] = [
  {
    id: '1',
    legajo: 'TFB-0001',
    firstName: 'Lucía',
    lastName: 'Fernández',
    documentType: 'DNI',
    documentNumber: '32456789',
    country: 'Argentina',
    birthDate: '1987-03-21',
    personalEmail: 'lucia.fernandez@gmail.com',
    phoneNumber: '+54 11 5555-0168',
    address: 'Av. Santa Fe 2840, 5.º B, Recoleta',
    city: 'Ciudad de Buenos Aires',
    zipCode: 'C1120',
    category: 'PERMANENT',
    workMode: 'REMOTE',
    dedication: 'FULL_TIME',
    role: 'Desarrolladora frontend',
    joinDate: '2021-03-12',
    state: 'ACTIVE',
    client: 'Banco del Plata',
    project: 'Banca digital',
    createdAt: '2023-05-01T09:21:00Z',
    updatedAt: '2024-03-02T12:31:00Z'
  },
  {
    id: '2',
    legajo: 'TFB-0002',
    firstName: 'Martín',
    lastName: 'Herrera',
    documentType: 'DNI',
    documentNumber: '37284952',
    country: 'Argentina',
    birthDate: '1990-07-08',
    personalEmail: 'martin.herrera@gmail.com',
    phoneNumber: '+54 11 1111-2345',
    address: 'Calle 12 48, San Telmo',
    city: 'Ciudad de Buenos Aires',
    zipCode: 'C1005',
    category: 'PERMANENT',
    workMode: 'ON_SITE',
    dedication: 'FULL_TIME',
    role: 'Líder técnico',
    joinDate: '2020-07-08',
    state: 'ACTIVE',
    client: 'Grupo Andino',
    project: 'Plataforma logística',
    createdAt: '2021-01-15T13:11:00Z',
    updatedAt: '2023-09-27T15:01:00Z'
  },
  {
    id: '3',
    legajo: 'TFB-0003',
    firstName: 'Sofía',
    lastName: 'Álvarez',
    documentType: 'DNI',
    documentNumber: '40231589',
    country: 'Argentina',
    birthDate: '2002-09-29',
    personalEmail: 'sofia.alvarez@nexo.com',
    phoneNumber: '+54 11 2123-4481',
    address: 'Independencia 3728, Lomas',
    city: 'Lanús',
    zipCode: '1824',
    category: 'INTERN',
    workMode: 'REMOTE',
    dedication: 'PART_TIME',
    role: 'Analista funcional',
    joinDate: '2025-02-05',
    state: 'ACTIVE',
    client: 'Nexo Salud',
    project: 'Portal pacientes',
    createdAt: '2025-02-05T08:00:00Z',
    updatedAt: '2025-05-21T14:18:00Z'
  },
  {
    id: '4',
    legajo: 'TFB-0004',
    firstName: 'Diego',
    lastName: 'Ríos',
    documentType: 'DNI',
    documentNumber: '31500248',
    country: 'Argentina',
    birthDate: '1997-09-18',
    personalEmail: 'diego.rios@banco.com',
    phoneNumber: '+54 11 2444-6781',
    address: 'Buenos Aires 672',
    city: 'La Plata',
    zipCode: '1900',
    category: 'PERMANENT',
    workMode: 'HYBRID',
    dedication: 'FULL_TIME',
    role: 'Analista de datos',
    joinDate: '2022-09-18',
    state: 'ACTIVE',
    client: 'Banco del Plata',
    project: 'Banca digital',
    createdAt: '2022-09-18T13:09:00Z',
    updatedAt: '2023-09-18T13:09:00Z'
  },
  {
    id: '5',
    legajo: 'TFB-0005',
    firstName: 'Valentina',
    lastName: 'Costa',
    documentType: 'DNI',
    documentNumber: '41356372',
    country: 'Uruguay',
    birthDate: '1995-11-21',
    personalEmail: 'valentina.costa@gmail.com',
    phoneNumber: '+598 99 555 465',
    address: 'Rambla Gandhi 999',
    city: 'Montevideo',
    zipCode: '11300',
    category: 'PERMANENT',
    workMode: 'REMOTE',
    dedication: 'FULL_TIME',
    role: 'Desarrolladora backend',
    joinDate: '2023-11-21',
    state: 'ACTIVE',
    client: 'Grupo Andino',
    project: 'Integraciones API',
    createdAt: '2023-11-21T10:09:00Z',
    updatedAt: '2024-03-13T09:17:00Z'
  },
  {
    id: '6',
    legajo: 'TFB-0006',
    firstName: 'Tomás',
    lastName: 'Medina',
    documentType: 'DNI',
    documentNumber: '49206481',
    country: 'Argentina',
    birthDate: '2004-03-03',
    personalEmail: 'tomas.medina@nexo.com',
    phoneNumber: '+54 11 8888-0442',
    address: 'Juncal 2000',
    city: 'Córdoba',
    zipCode: '5000',
    category: 'INTERN',
    workMode: 'ON_SITE',
    dedication: 'PART_TIME',
    role: 'Pruebas de software',
    joinDate: '2025-03-03',
    state: 'ACTIVE',
    client: 'Nexo Salud',
    project: 'Portal pacientes',
    createdAt: '2025-03-03T11:11:00Z',
    updatedAt: '2025-06-10T14:11:00Z'
  },
  {
    id: '7',
    legajo: 'TFB-0007',
    firstName: 'Camila',
    lastName: 'Suárez',
    documentType: 'DNI',
    documentNumber: '31385211',
    country: 'Argentina',
    birthDate: '1992-06-14',
    personalEmail: 'camila.suarez@gmail.com',
    phoneNumber: '+54 11 3333-6677',
    address: 'Av. Rivadavia 5600',
    city: 'Ciudad de Buenos Aires',
    zipCode: 'C1406',
    category: 'PERMANENT',
    workMode: 'HYBRID',
    dedication: 'FULL_TIME',
    role: 'Diseñadora UX',
    joinDate: '2019-06-14',
    state: 'INACTIVE',
    client: null,
    project: null,
    createdAt: '2019-06-14T08:30:00Z',
    updatedAt: '2024-04-10T09:10:00Z'
  },
  {
    id: '8',
    legajo: 'TFB-0008',
    firstName: 'Nicolás',
    lastName: 'Vega',
    documentType: 'DNI',
    documentNumber: '42287699',
    country: 'Argentina',
    birthDate: '2003-01-09',
    personalEmail: 'nico.vega@gmail.com',
    phoneNumber: '+54 11 4020-1895',
    address: 'Mitre 773',
    city: 'Rosario',
    zipCode: '2000',
    category: 'INTERN',
    workMode: 'REMOTE',
    dedication: 'PART_TIME',
    role: 'Soporte técnico',
    joinDate: '2024-01-09',
    state: 'INACTIVE',
    client: null,
    project: null,
    createdAt: '2024-01-09T09:12:00Z',
    updatedAt: '2024-06-09T11:42:00Z'
  }
];

function notFound(id: string): Observable<never> {
  return mockError(404, `No existe el colaborador con id: ${id}`);
}

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<Employee>> {
  let filtered = employees;
  if (filters.search.trim()) {
    const s = filters.search.trim().toLowerCase();
    filtered = filtered.filter(
      e => (
        (e.firstName + ' ' + e.lastName).toLowerCase().includes(s) ||
        e.legajo.toLowerCase().includes(s)
      )
    );
  }
  if (filters.legajo.trim()) {
    filtered = filtered.filter(e => e.legajo.toLowerCase().includes(filters.legajo.toLowerCase()));
  }
  if (filters.category) {
    filtered = filtered.filter(e => e.category === filters.category);
  }
  if (filters.client) {
    filtered = filtered.filter(e => (e.client?.toLowerCase() ?? '') === filters.client.toLowerCase());
  }
  if (filters.project) {
    filtered = filtered.filter(e => (e.project?.toLowerCase() ?? '') === filters.project.toLowerCase());
  }
  if (filters.state) {
    filtered = filtered.filter(e => e.state === filters.state);
  }
  return mockResponse(toPage(filtered, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<Employee> {
  const found = employees.find(e => e.id === id);
  return found ? mockResponse(found) : notFound(id);
}

export function createEmployeeMock(request: CreateEmployeeRequest): Observable<Employee> {
  // Duplicado por documento
  if (employees.some(e => e.documentType === request.documentType && e.documentNumber === request.documentNumber)) {
    return mockError(409, 'Ya existe un colaborador con ese tipo y número de documento.', { documentNumber: ['Ya existe un colaborador registrado con ese documento.'] });
  }
  // Duplicado por correo personal
  if (employees.some(e => e.personalEmail === request.personalEmail)) {
    return mockError(409, 'Ya existe un colaborador con ese correo personal.', { personalEmail: ['Este correo ya está en uso.'] });
  }
  const id = (Date.now()).toString();
  const legajo = `TFB-${(employees.length + 1).toString().padStart(4, '0')}`;
  const now = new Date().toISOString();
  const employee: Employee = {
    id,
    legajo,
    firstName: request.firstName,
    lastName: request.lastName,
    documentType: request.documentType,
    documentNumber: request.documentNumber,
    country: request.country,
    birthDate: request.birthDate,
    personalEmail: request.personalEmail,
    phoneNumber: request.phoneNumber,
    address: request.address,
    city: request.city,
    zipCode: request.zipCode,
    category: request.category,
    workMode: request.workMode,
    dedication: request.dedication,
    role: request.role,
    joinDate: request.joinDate,
    state: 'ACTIVE',
    client: request.client,
    project: request.project,
    createdAt: now,
    updatedAt: now
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}

export function updateEmployeeMock(id: string, request: UpdateEmployeeRequest): Observable<Employee> {
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return notFound(id);
  // Duplicado por documento
  if (employees.some(e => e.id !== id && e.documentType === request.documentType && e.documentNumber === request.documentNumber)) {
    return mockError(409, 'Ya existe otro colaborador con ese documento.', { documentNumber: ['Ya existe otro colaborador con ese documento.'] });
  }
  // Duplicado por correo personal
  if (employees.some(e => e.id !== id && e.personalEmail === request.personalEmail)) {
    return mockError(409, 'Ya existe otro colaborador con ese correo personal.', { personalEmail: ['Este correo ya está en uso.'] });
  }
  const updated: Employee = {
    ...employees[index],
    ...request,
    updatedAt: new Date().toISOString()
  };
  employees = employees.map((e, i) => (i === index ? updated : e));
  return mockResponse(updated);
}

export function leaveEmployeeMock(id: string): Observable<void> {
  const index = employees.findIndex(e => e.id === id);
  if (index === -1) return notFound(id);
  if (employees[index].state === 'INACTIVE') {
    return mockError(409, 'El colaborador ya está inactivo.');
  }
  employees[index] = { ...employees[index], state: 'INACTIVE', updatedAt: new Date().toISOString() };
  return mockResponse(undefined);
}

export function rejoinEmployeeMock(id: string): Observable<Employee> {
  const employee = employees.find(e => e.id === id);
  if (!employee) return notFound(id);
  if (employee.state !== 'INACTIVE') {
    return mockError(409, 'Solo puede reingresar un colaborador inactivo.');
  }
  const updated: Employee = {
    ...employee,
    state: 'ACTIVE',
    updatedAt: new Date().toISOString(),
    joinDate: new Date().toISOString().slice(0, 10)
  };
  employees = employees.map(e => (e.id === id ? updated : e));
  return mockResponse(updated);
}
