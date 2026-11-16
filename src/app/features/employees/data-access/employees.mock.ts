import { Observable } from 'rxjs';
import { mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { EmployeeResponse } from '../models/employees.models';

const employees: EmployeeResponse[] = [
  {
    id: 'emp-1001', employeeNumber: 'TF-001', firstName: 'María', lastName: 'García',
    birthDate: '1992-05-14', residenceCountry: 'Argentina', personalEmail: 'maria.garcia@example.com',
    startDate: '2022-03-01', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'HYBRID',
    jobRole: 'Desarrolladora', status: 'ACTIVE', initialClient: 'Cliente Norte',
    initialProject: 'Portal interno', initialManager: 'Coordinación técnica', createdAt: '2022-03-01T12:00:00Z',
  },
  {
    id: 'emp-1002', employeeNumber: 'TF-002', firstName: 'Juan', lastName: 'Pérez',
    birthDate: '1999-09-08', residenceCountry: 'México', personalEmail: 'juan.perez@example.com',
    startDate: '2025-02-10', category: 'INTERN', dedication: 'PART_TIME', workMode: 'REMOTE',
    jobRole: 'Analista de datos', status: 'ACTIVE', initialClient: 'Cliente Sur',
    initialProject: 'Análisis de datos', initialManager: null, createdAt: '2025-02-10T14:30:00Z',
  },
  {
    id: 'emp-1003', employeeNumber: 'TF-003', firstName: 'Lucía', lastName: 'Fernández',
    birthDate: '1988-11-22', residenceCountry: 'Argentina', personalEmail: 'lucia.fernandez@example.com',
    startDate: '2021-07-05', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'ONSITE',
    jobRole: 'Diseñadora', status: 'INACTIVE', initialClient: 'Cliente Norte',
    initialProject: 'Portal interno', initialManager: null, createdAt: '2021-07-05T09:00:00Z',
  },
  {
    id: 'emp-1004', employeeNumber: 'TF-004', firstName: 'Ana', lastName: 'López',
    birthDate: '1995-01-30', residenceCountry: 'México', personalEmail: 'ana.lopez@example.com',
    startDate: '2024-06-17', category: 'PERMANENT', dedication: 'FULL_TIME', workMode: 'REMOTE',
    jobRole: 'Líder de proyecto', status: 'ACTIVE', initialClient: 'Cliente Sur',
    initialProject: 'Análisis de datos', initialManager: 'Dirección de proyectos', createdAt: '2024-06-17T10:00:00Z',
  },
];

export function listEmployeesMock(page: number, size: number): Observable<Page<EmployeeResponse>> {
  return mockResponse(toPage(employees, page, size));
}
