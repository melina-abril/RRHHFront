import { Observable, of } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import {
  Employee,
  EmployeeCategory,
  EmployeeDetail,
  EmployeeFilters,
  EmployeeStatus
} from '../models/employees.models';

/** Lista en memoria de empleados simulados */
let employees: Employee[] = [
  {
    id: '1',
    legajo: 'TFB-0001',
    firstName: 'Lucía',
    lastName: 'Fernández',
    category: 'PERMANENTE',
    status: 'ACTIVE',
    client: 'Banco del Plata',
    project: 'Banca digital',
    position: 'Desarrolladora frontend',
    hireDate: '2021-03-12',
    email: 'lucia.fernandez@gmail.com',
    phone: '+54 11 5555-0168',
    documentType: 'DNI',
    documentNumber: '32456789',
  },
  {
    id: '2',
    legajo: 'TFB-0002',
    firstName: 'Martín',
    lastName: 'Herrera',
    category: 'PERMANENTE',
    status: 'ACTIVE',
    client: 'Grupo Andino',
    project: 'Plataforma logística',
    position: 'Líder técnico',
    hireDate: '2020-07-08',
    email: 'martin.herrera@gmail.com',
    phone: '+54 11 5555-0193',
    documentType: 'DNI',
    documentNumber: '32220789',
  },
  {
    id: '3',
    legajo: 'TFB-0003',
    firstName: 'Sofía',
    lastName: 'Álvarez',
    category: 'PASANTE',
    status: 'ACTIVE',
    client: 'Nexo Salud',
    project: 'Portal pacientes',
    position: 'Analista funcional',
    hireDate: '2025-02-05',
    email: 'sofia.alvarez@gmail.com',
    phone: '+54 11 5555-0335',
    documentType: 'DNI',
    documentNumber: '35456789',
  },
  {
    id: '4',
    legajo: 'TFB-0004',
    firstName: 'Diego',
    lastName: 'Ríos',
    category: 'PERMANENTE',
    status: 'ACTIVE',
    client: 'Banco del Plata',
    project: 'Banca digital',
    position: 'Analista de datos',
    hireDate: '2022-09-18',
    email: 'diego.rios@gmail.com',
    phone: '+54 11 5555-0249',
    documentType: 'DNI',
    documentNumber: '33456119',
  },
  {
    id: '5',
    legajo: 'TFB-0005',
    firstName: 'Valentina',
    lastName: 'Costa',
    category: 'PERMANENTE',
    status: 'ACTIVE',
    client: 'Grupo Andino',
    project: 'Integraciones API',
    position: 'Desarrolladora backend',
    hireDate: '2023-11-21',
    email: 'valentina.costa@gmail.com',
    phone: '+54 11 5555-0212',
    documentType: 'DNI',
    documentNumber: '34788912',
  },
  {
    id: '6',
    legajo: 'TFB-0006',
    firstName: 'Tomás',
    lastName: 'Medina',
    category: 'PASANTE',
    status: 'ACTIVE',
    client: 'Nexo Salud',
    project: 'Portal pacientes',
    position: 'Pruebas de software',
    hireDate: '2025-03-03',
    email: 'tomas.medina@gmail.com',
    phone: '+54 11 5555-0447',
    documentType: 'DNI',
    documentNumber: '32455789',
  },
  {
    id: '7',
    legajo: 'TFB-0007',
    firstName: 'Camila',
    lastName: 'Suárez',
    category: 'PERMANENTE',
    status: 'INACTIVE',
    client: '',
    project: '',
    position: 'Diseñadora UX',
    hireDate: '2019-06-14',
    email: 'camila.suarez@gmail.com',
    phone: '+54 11 5555-0656',
    documentType: 'DNI',
    documentNumber: '31456119',
  },
  {
    id: '8',
    legajo: 'TFB-0008',
    firstName: 'Nicolás',
    lastName: 'Vega',
    category: 'PASANTE',
    status: 'INACTIVE',
    client: '',
    project: '',
    position: 'Soporte técnico',
    hireDate: '2024-01-09',
    email: 'nicolas.vega@gmail.com',
    phone: '+54 11 5555-0614',
    documentType: 'DNI',
    documentNumber: '30956119',
  },
];

const detailBase: Omit<EmployeeDetail, keyof Employee | 'id' | 'legajo'> = {
  nationality: 'Argentina',
  residenceCountry: 'Argentina',
  address: 'Av. Santa Fe 2840, 5.º B, Recoleta, CABA',
  birthDate: '1987-03-21',
  emergencyContact: 'Martín Fernández',
  emergencyPhone: '+54 11 5555-0243',
  corporateEmail: '',
  department: 'IT',
  team: '',
  manager: '',
  updatedAt: '2026-02-12',
};

/** Mocks de empleados: list, get (detalle); sin alta/edición/baja todavía (serán agregados en pasos siguientes) */

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<Employee>> {
  let lista = employees.slice();
  if (filters.search.trim()) {
    const search = filters.search.toLowerCase();
    lista = lista.filter(
      (e) =>
        e.firstName.toLowerCase().includes(search) ||
        e.lastName.toLowerCase().includes(search) ||
        e.legajo.toLowerCase().includes(search)
    );
  }
  if (filters.status) {
    lista = lista.filter((e) => e.status === filters.status);
  }
  if (filters.category) {
    lista = lista.filter((e) => e.category === filters.category);
  }
  if (filters.client) {
    lista = lista.filter((e) => (e.client ?? '') === filters.client);
  }
  if (filters.project) {
    lista = lista.filter((e) => (e.project ?? '') === filters.project);
  }
  return mockResponse(toPage(lista, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<EmployeeDetail> {
  const base = employees.find((e) => e.id === id);
  if (!base) return mockError(404, 'No se encontró el colaborador.');
  return mockResponse<EmployeeDetail>({
    ...base,
    ...detailBase,
    corporateEmail: base.email.replace('@gmail.com', '@techforb.com'),
    updatedAt: detailBase.updatedAt,
  });
}
