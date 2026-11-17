import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import {
  CategoryChangeRequest,
  DepartureRequest,
  EmploymentCategory,
  EmploymentMovementResponse,
  EmploymentMovementsResponse,
  EmploymentStatus,
  MovementType,
  RehireRequest,
} from '../models/employment-movements.models';

let employees: EmploymentMovementsResponse[] = [
  {
    employeeId: 'e-418', employeeNumber: '00418', firstName: 'Martina', lastName: 'López',
    category: 'INTERN', status: 'ACTIVE', startDate: '2025-02-03',
    movements: [
      { id: 'm-3', type: 'REHIRE', effectiveDate: '2025-02-03', previousCategory: 'INTERN', category: 'INTERN', previousStatus: 'INACTIVE', status: 'ACTIVE', reason: 'Nuevo período laboral', recordedById: 'admin-1', recordedAt: '2025-02-03T10:00:00Z' },
      { id: 'm-2', type: 'DEPARTURE', effectiveDate: '2024-12-20', previousCategory: 'INTERN', category: 'INTERN', previousStatus: 'ACTIVE', status: 'INACTIVE', reason: 'Fin del primer período', recordedById: 'admin-1', recordedAt: '2024-12-20T11:00:00Z' },
      { id: 'm-1', type: 'HIRE', effectiveDate: '2024-08-05', previousCategory: null, category: 'INTERN', previousStatus: null, status: 'ACTIVE', reason: null, recordedById: 'admin-1', recordedAt: '2024-08-05T09:00:00Z' },
    ],
  },
  {
    employeeId: 'e-356', employeeNumber: '00356', firstName: 'Sofía', lastName: 'Castro',
    category: 'PERMANENT', status: 'INACTIVE', startDate: '2022-03-01',
    movements: [
      { id: 'm-5', type: 'DEPARTURE', effectiveDate: '2025-08-31', previousCategory: 'PERMANENT', category: 'PERMANENT', previousStatus: 'ACTIVE', status: 'INACTIVE', reason: 'Fin del período laboral', recordedById: 'admin-1', recordedAt: '2025-08-31T12:00:00Z' },
      { id: 'm-4', type: 'HIRE', effectiveDate: '2022-03-01', previousCategory: null, category: 'PERMANENT', previousStatus: null, status: 'ACTIVE', reason: null, recordedById: 'admin-1', recordedAt: '2022-03-01T09:00:00Z' },
    ],
  },
];

function findEmployee(id: string): EmploymentMovementsResponse | undefined {
  return employees.find((employee) => employee.employeeId === id);
}

function missing(id: string): Observable<never> {
  return mockError(404, `No se encontró el colaborador ${id}.`);
}

export function getEmploymentMovementsMock(id: string): Observable<EmploymentMovementsResponse> {
  const employee = findEmployee(id);
  return employee ? mockResponse({ ...employee, movements: [...employee.movements] }) : missing(id);
}

function saveMovement(
  id: string,
  type: MovementType,
  effectiveDate: string,
  category: EmploymentCategory,
  status: EmploymentStatus,
  reason: string,
): Observable<EmploymentMovementsResponse> {
  const employee = findEmployee(id);
  if (!employee) return missing(id);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(effectiveDate) || Number.isNaN(Date.parse(`${effectiveDate}T00:00:00Z`))) {
    return mockError(422, 'Ingresa una fecha válida.', { effectiveDate: ['Ingresa una fecha válida en formato AAAA-MM-DD.'] });
  }
  if (!reason.trim() || reason.trim().length > 500) {
    return mockError(422, 'Revisa el motivo.', { reason: ['Ingresa un motivo de hasta 500 caracteres.'] });
  }
  if (employee.movements.some((movement) => movement.type === type && movement.effectiveDate === effectiveDate)) {
    return mockError(409, 'Ya existe este movimiento para la fecha indicada.', { effectiveDate: ['Ya existe un movimiento de este tipo en esa fecha.'] });
  }
  const latestDate = employee.movements.reduce((latest, movement) => movement.effectiveDate > latest ? movement.effectiveDate : latest, employee.startDate);
  if (effectiveDate < latestDate) {
    return mockError(422, 'La fecha no puede ser anterior al último movimiento.', { effectiveDate: ['Revisa la cronología del legajo.'] });
  }
  if ((type === 'CATEGORY_CHANGE' && (employee.status !== 'ACTIVE' || employee.category !== 'INTERN' || category !== 'PERMANENT')) ||
      (type === 'DEPARTURE' && employee.status !== 'ACTIVE') ||
      (type === 'REHIRE' && employee.status !== 'INACTIVE')) {
    return mockError(409, 'La condición actual no permite este movimiento.');
  }
  const movement: EmploymentMovementResponse = {
    id: `m-${Date.now()}`, type, effectiveDate,
    previousCategory: employee.category, category,
    previousStatus: employee.status, status,
    reason: reason.trim(), recordedById: 'admin-1', recordedAt: new Date().toISOString(),
  };
  const updated: EmploymentMovementsResponse = {
    ...employee, category, status,
    startDate: type === 'REHIRE' ? effectiveDate : employee.startDate,
    movements: [movement, ...employee.movements].sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate)),
  };
  employees = employees.map((item) => item.employeeId === id ? updated : item);
  return mockResponse(updated);
}

export function changeCategoryMock(id: string, request: CategoryChangeRequest): Observable<EmploymentMovementsResponse> {
  return saveMovement(id, 'CATEGORY_CHANGE', request.effectiveDate, request.category, 'ACTIVE', request.reason);
}

export function registerDepartureMock(id: string, request: DepartureRequest): Observable<EmploymentMovementsResponse> {
  const employee = findEmployee(id);
  return employee ? saveMovement(id, 'DEPARTURE', request.effectiveDate, employee.category, 'INACTIVE', request.reason) : missing(id);
}

export function registerRehireMock(id: string, request: RehireRequest): Observable<EmploymentMovementsResponse> {
  return saveMovement(id, 'REHIRE', request.effectiveDate, request.category, 'ACTIVE', request.reason);
}
