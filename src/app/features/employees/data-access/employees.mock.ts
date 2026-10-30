import { Observable, of } from 'rxjs';
import { delay } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { EmployeeDetails, EmployeeFilters, EmployeeList, CreateEmployeeRequest, EmployeeCategory, EmployeeStatus } from '../models/employees.models';

const MOCK_EMPS: EmployeeList[] = [
  {
    id: '01',
    legajo: 'TFB-0001',
    firstName: 'Lucía',
    lastName: 'Fernández',
    email: 'lucia.fernandez@gmail.com',
    category: 'PERMANENT',
    status: 'ACTIVE',
    countryCode: 'AR',
    city: 'Buenos Aires',
    entryDate: '2021-03-12',
    position: 'Desarrolladora frontend',
    clients: ['Banco del Plata'],
    projects: ['Banca digital', 'Portal clientes'],
    updatedAt: '2026-02-12T09:40:00Z',
  },
  {
    id: '02',
    legajo: 'TFB-0002',
    firstName: 'Martín',
    lastName: 'Herrera',
    email: 'martin.herrera@techforb.com',
    category: 'PERMANENT',
    status: 'ACTIVE',
    countryCode: 'AR',
    city: 'Córdoba',
    entryDate: '2020-07-08',
    position: 'Líder técnico',
    clients: ['Grupo Andino'],
    projects: ['Plataforma logística'],
    updatedAt: '2026-01-25T15:10:00Z',
  },
  {
    id: '03',
    legajo: 'TFB-0003',
    firstName: 'Sofía',
    lastName: 'Álvarez',
    email: 'sofia.alvarez@nexosalud.com',
    category: 'INTERN',
    status: 'ACTIVE',
    countryCode: 'AR',
    city: 'Rosario',
    entryDate: '2025-02-05',
    position: 'Analista funcional',
    clients: ['Nexo Salud'],
    projects: ['Portal pacientes'],
    updatedAt: '2026-05-02T12:00:00Z',
  },
  {
    id: '04',
    legajo: 'TFB-0004',
    firstName: 'Diego',
    lastName: 'Ríos',
    email: 'diego.rios@techforb.com',
    category: 'PERMANENT',
    status: 'ACTIVE',
    countryCode: 'AR',
    city: 'La Plata',
    entryDate: '2022-09-18',
    position: 'Analista de datos',
    clients: ['Banco del Plata'],
    projects: ['Banca digital'],
    updatedAt: '2026-04-09T16:20:00Z',
  },
  {
    id: '05',
    legajo: 'TFB-0005',
    firstName: 'Valentina',
    lastName: 'Costa',
    email: 'valentina.costa@techforb.com',
    category: 'PERMANENT',
    status: 'ACTIVE',
    countryCode: 'AR',
    city: 'Mendoza',
    entryDate: '2023-11-21',
    position: 'Desarrolladora backend',
    clients: ['Grupo Andino'],
    projects: ['Integraciones API'],
    updatedAt: '2026-04-14T10:10:00Z',
  },
  {
    id: '06',
    legajo: 'TFB-0006',
    firstName: 'Tomás',
    lastName: 'Medina',
    email: 'tomas.medina@nexosalud.com',
    category: 'INTERN',
    status: 'ACTIVE',
    countryCode: 'AR',
    city: 'Salta',
    entryDate: '2025-03-03',
    position: 'Pruebas de software',
    clients: ['Nexo Salud'],
    projects: ['Portal pacientes'],
    updatedAt: '2026-04-19T17:50:00Z',
  },
  {
    id: '07',
    legajo: 'TFB-0007',
    firstName: 'Camila',
    lastName: 'Suárez',
    email: 'camila.suarez@techforb.com',
    category: 'PERMANENT',
    status: 'INACTIVE',
    countryCode: 'AR',
    city: 'Buenos Aires',
    entryDate: '2019-06-14',
    position: 'Diseñadora UX',
    clients: [],
    projects: [],
    updatedAt: '2026-04-30T10:09:00Z',
  },
  {
    id: '08',
    legajo: 'TFB-0008',
    firstName: 'Nicolás',
    lastName: 'Vega',
    email: 'nicolas.vega@techforb.com',
    category: 'INTERN',
    status: 'INACTIVE',
    countryCode: 'AR',
    city: 'CABA',
    entryDate: '2024-01-09',
    position: 'Soporte técnico',
    clients: [],
    projects: [],
    updatedAt: '2026-05-09T11:15:00Z',
  },
];

let employees: EmployeeList[] = [...MOCK_EMPS];

const getFullName = (emp: Pick<EmployeeDetails, 'firstName' | 'lastName'>): string => `${emp.firstName} ${emp.lastName}`;

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<EmployeeList>> {
  const search = filters.search.trim().toLowerCase();
  let filtered = employees;

  if (search) {
    filtered = filtered.filter(emp =>
      emp.firstName.toLowerCase().includes(search) ||
      emp.lastName.toLowerCase().includes(search) ||
      emp.legajo.toLowerCase().includes(search)
    );
  }
  if (filters.legajo) {
    filtered = filtered.filter(emp => emp.legajo.toLowerCase().includes(filters.legajo.trim().toLowerCase()));
  }
  if (filters.category) {
    filtered = filtered.filter(emp => emp.category === filters.category);
  }
  if (filters.status) {
    filtered = filtered.filter(emp => emp.status === filters.status);
  }
  if (filters.client) {
    filtered = filtered.filter(emp => emp.clients.includes(filters.client));
  }
  if (filters.project) {
    filtered = filtered.filter(emp => emp.projects.includes(filters.project));
  }
  return mockResponse(toPage(filtered, filters.page, filters.size));
}

export function getEmployeeDetailsMock(id: string): Observable<EmployeeDetails> {
  const found = employees.find(emp => emp.id === id);
  if (!found) return mockError(404, 'No existe el colaborador solicitado.');
  // Mocks: en la ficha agrego sample de backgroundNotes según el nombre
  return mockResponse({
    ...found,
    backgroundNotes: [
      `Alta en TECHFORB (${found.entryDate})`,
      found.position ? `Asignado como ${found.position}` : '',
      found.status === 'ACTIVE' ? 'Antigüedad vigente' : 'Registro inactivo'
    ].filter(Boolean),
    updatedAt: found.updatedAt,
  });
}

export function createEmployeeMock(request: CreateEmployeeRequest): Observable<EmployeeDetails> {
  // Validación dummy: email duplicado
  const duplicated = employees.some(emp => emp.email.toLowerCase() === request.email.toLowerCase());
  if (duplicated) {
    return mockError(409, 'El correo electrónico ya está en uso.', { email: ['El correo electrónico ya corresponde a otro colaborador.'] });
  }
  // Legajo autogenerado, similar al mock
  const nextLegajo = `TFB-${(employees.length + 1).toString().padStart(4, '0')}`;
  const id = (Date.now() + Math.floor(Math.random() * 1000)).toString();
  const now = new Date().toISOString();
  const newEmp: EmployeeList = {
    id,
    legajo: nextLegajo,
    firstName: request.firstName,
    lastName: request.lastName,
    email: request.email,
    category: request.category,
    status: 'ACTIVE',
    countryCode: request.countryCode,
    city: request.city,
    entryDate: request.entryDate,
    position: request.position,
    clients: [...(request.clients ?? [])],
    projects: [...(request.projects ?? [])],
    updatedAt: now,
  };
  employees = [newEmp, ...employees];
  return mockResponse({
    ...newEmp,
    backgroundNotes: [`Alta en TECHFORB (${request.entryDate})`],
    updatedAt: now,
  });
}