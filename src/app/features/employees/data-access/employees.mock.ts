import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { EmployeeDto, EmployeeRequest, EmployeesPageQuery } from '../models/employees.models';

let employees: EmployeeDto[] = [
  { id: 'E-0001', employeeNumber: 'E-0001', firstName: 'Lucía', lastName: 'Fernández', documentType: 'DNI', documentNumber: '32456789', birthDate: '1987-03-21', email: 'lucia.fernandez@example.com', phone: '+54 11 5555 0168', hireDate: '2021-03-12', terminationDate: null, departmentId: 'Tecnología', positionId: 'Desarrollo frontend', managerId: null, status: 'ACTIVE', createdAt: '2021-03-12T12:00:00Z', updatedAt: '2026-02-12T12:00:00Z' },
  { id: 'E-0002', employeeNumber: 'E-0002', firstName: 'Martín', lastName: 'Herrera', documentType: 'DNI', documentNumber: '30111222', birthDate: '1990-07-08', email: 'martin.herrera@example.com', phone: '+54 11 5555 0192', hireDate: '2020-07-08', terminationDate: null, departmentId: 'Tecnología', positionId: 'Liderazgo técnico', managerId: null, status: 'ACTIVE', createdAt: '2020-07-08T12:00:00Z', updatedAt: '2026-01-15T12:00:00Z' },
  { id: 'E-0003', employeeNumber: 'E-0003', firstName: 'Camila', lastName: 'Suárez', documentType: 'DNI', documentNumber: '35444555', birthDate: '1993-06-14', email: 'camila.suarez@example.com', phone: '', hireDate: '2019-06-14', terminationDate: '2025-12-31', departmentId: 'Diseño', positionId: 'Diseño UX', managerId: null, status: 'TERMINATED', createdAt: '2019-06-14T12:00:00Z', updatedAt: '2025-12-31T12:00:00Z' },
];

function notFound(id: string): Observable<never> {
  return mockError(404, `No se encontró el colaborador ${id}.`);
}

export function listEmployeesMock(filters: EmployeesPageQuery): Observable<Page<EmployeeDto>> {
  const search = (filters.search ?? '').trim().toLocaleLowerCase();
  const matches = employees.filter((employee) =>
    (!search || `${employee.firstName} ${employee.lastName}`.toLocaleLowerCase().includes(search) || employee.employeeNumber.toLocaleLowerCase().includes(search)) &&
    (!filters.status || employee.status === filters.status) &&
    (!filters.departmentId || employee.departmentId === filters.departmentId) &&
    (!filters.positionId || employee.positionId === filters.positionId),
  );
  return mockResponse(toPage(matches, filters.page, filters.size));
}

export function getEmployeeByIdMock(id: string): Observable<EmployeeDto> {
  const employee = employees.find((item) => item.id === id);
  return employee ? mockResponse(employee) : notFound(id);
}

export function createEmployeeMock(request: EmployeeRequest): Observable<EmployeeDto> {
  if (employees.some((item) => item.documentType === request.documentType && item.documentNumber === request.documentNumber)) {
    return mockError(409, 'Ya existe un colaborador con ese documento.', { documentNumber: ['El documento ya está registrado.'] });
  }
  if (!request.firstName.trim() || !request.lastName.trim() || !request.documentNumber.trim() || !request.hireDate) {
    return mockError(422, 'Revisa los datos obligatorios.');
  }
  const next = Math.max(0, ...employees.map((item) => Number(item.employeeNumber.replace('E-', '')) || 0)) + 1;
  const employeeNumber = `E-${String(next).padStart(4, '0')}`;
  const now = new Date().toISOString();
  const employee: EmployeeDto = { ...request, id: employeeNumber, employeeNumber, status: 'ACTIVE', terminationDate: null, createdAt: now, updatedAt: now };
  employees = [employee, ...employees];
  return mockResponse(employee);
}

export function updateEmployeeMock(id: string, request: EmployeeRequest): Observable<EmployeeDto> {
  const current = employees.find((item) => item.id === id);
  if (!current) return notFound(id);
  if (current.status === 'TERMINATED') return mockError(422, 'No se puede editar un colaborador inactivo.');
  if (employees.some((item) => item.id !== id && item.documentType === request.documentType && item.documentNumber === request.documentNumber)) {
    return mockError(409, 'Ya existe un colaborador con ese documento.', { documentNumber: ['El documento ya está registrado.'] });
  }
  const updated: EmployeeDto = { ...current, ...request, updatedAt: new Date().toISOString() };
  employees = employees.map((item) => item.id === id ? updated : item);
  return mockResponse(updated);
}

export function leaveEmployeeMock(id: string): Observable<EmployeeDto> {
  const current = employees.find((item) => item.id === id);
  if (!current) return notFound(id);
  if (current.status === 'TERMINATED') return mockError(422, 'El colaborador ya está inactivo.');
  const now = new Date().toISOString();
  const updated: EmployeeDto = { ...current, status: 'TERMINATED', terminationDate: now.slice(0, 10), updatedAt: now };
  employees = employees.map((item) => item.id === id ? updated : item);
  return mockResponse(updated);
}

export function rejoinEmployeeMock(id: string, hireDate: string): Observable<EmployeeDto> {
  const current = employees.find((item) => item.id === id);
  if (!current) return notFound(id);
  if (current.status !== 'TERMINATED') return mockError(422, 'Solo se puede reingresar a un colaborador inactivo.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(hireDate)) return mockError(422, 'Ingresa una fecha de reingreso válida.', { hireDate: ['La fecha de reingreso es obligatoria.'] });
  const updated: EmployeeDto = { ...current, hireDate, terminationDate: null, status: 'ACTIVE', updatedAt: new Date().toISOString() };
  employees = employees.map((item) => item.id === id ? updated : item);
  return mockResponse(updated);
}
