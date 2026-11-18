import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { Employee, EmployeeCreateRequest, EmployeeFilters } from '../models/employees.models';

let employees: Employee[] = [
  { id: 'employee-1', employeeNumber: 'TF-00124', firstName: 'Lucía', lastName: 'Martínez', fullName: 'Lucía Martínez', email: 'lucia.martinez@example.com', category: 'PERMANENT', country: 'Argentina', position: 'Diseñadora de producto', clientNames: ['NovaBank'], projectNames: ['Portal de clientes', 'App móvil'], status: 'ACTIVE', hireDate: '2021-03-12', terminationDate: null },
  { id: 'employee-2', employeeNumber: 'TF-00131', firstName: 'Martín', lastName: 'Gómez', fullName: 'Martín Gómez', email: 'martin.gomez@example.com', category: 'INTERN', country: 'México', position: 'Desarrollador', clientNames: ['Mercado Norte'], projectNames: ['Plataforma de ventas'], status: 'ACTIVE', hireDate: '2025-06-01', terminationDate: null },
  { id: 'employee-3', employeeNumber: 'TF-00083', firstName: 'Paula', lastName: 'Méndez', fullName: 'Paula Méndez', email: 'paula.mendez@example.com', category: 'PERMANENT', country: 'Argentina', position: 'Analista de datos', clientNames: [], projectNames: [], status: 'INACTIVE', hireDate: '2020-02-03', terminationDate: '2025-11-30' },
];

export function listEmployeesMock(filters: EmployeeFilters): Observable<Page<Employee>> {
  const search = filters.search.trim().toLocaleLowerCase();
  const matches = employees.filter(employee =>
    (!search || employee.fullName.toLocaleLowerCase().startsWith(search) || employee.firstName.toLocaleLowerCase().startsWith(search) || employee.lastName.toLocaleLowerCase().startsWith(search) || employee.employeeNumber.toLocaleLowerCase().startsWith(search)) &&
    (!filters.category || employee.category === filters.category) &&
    (!filters.status || employee.status === filters.status) &&
    (!filters.country || employee.country === filters.country) &&
    (!filters.client || employee.clientNames.includes(filters.client)) &&
    (!filters.project || employee.projectNames.includes(filters.project))
  );
  return mockResponse(toPage(matches, filters.page, filters.size));
}

export function getEmployeeMock(id: string): Observable<Employee> {
  const employee = employees.find(item => item.id === id);
  return employee ? mockResponse(employee) : mockError(404, 'No se encontró el colaborador.');
}

export function createEmployeeMock(request: EmployeeCreateRequest): Observable<Employee> {
  if (employees.some(item => item.email.toLocaleLowerCase() === request.email.toLocaleLowerCase())) {
    return mockError(409, 'Ya existe un colaborador con ese correo.', { email: ['El correo ya está registrado.'] });
  }
  if (!request.firstName.trim() || !request.lastName.trim() || !request.country.trim() || !request.position.trim()) {
    return mockError(422, 'Revisa los datos obligatorios.');
  }
  const nextNumber = Math.max(0, ...employees.map(item => Number(item.employeeNumber.replace('TF-', '')))) + 1;
  const employee: Employee = {
    ...request,
    id: `employee-${nextNumber}`,
    employeeNumber: `TF-${String(nextNumber).padStart(5, '0')}`,
    fullName: `${request.firstName.trim()} ${request.lastName.trim()}`,
    status: 'ACTIVE',
    terminationDate: null,
  };
  employees = [employee, ...employees];
  return mockResponse(employee);
}
