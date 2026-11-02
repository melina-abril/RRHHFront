import { BadgeTone } from '../../../shared/components/status-badge';
import { Page } from '../../../shared/models/page';

/** Estados posibles del colaborador. */
export type EmployeeStatus = 'ACTIVE' | 'TERMINATED';

export const EMPLOYEE_STATUS: Record<EmployeeStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Activo', tone: 'success' },
  TERMINATED: { label: 'Inactivo', tone: 'danger' },
};

export const EMPLOYEE_STATUS_OPTIONS: readonly { value: EmployeeStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'TERMINATED', label: 'Inactivo' },
];

/**
 * Respuesta de un colaborador (GET /employees/:id, lista), campos igual que EmployeeDto del backend.
 * Fechas como string ISO (o null), todos los campos legibles vienen como string.
 */
export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string | null;
  email: string;
  phone: string;
  hireDate: string | null;
  terminationDate: string | null;
  departmentId: string;
  positionId: string;
  managerId: string | null;
  status: EmployeeStatus;
  createdAt: string | null;
  updatedAt: string | null;
}

/** Body para alta y edición (POST /employees, PUT /employees/:id). */
export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  email: string;
  phone: string;
  hireDate: string;
  departmentId: string;
  positionId: string;
  managerId: string | null;
}

/** Filtros del listado (GET /employees). */
export interface EmployeeFilters {
  search: string;
  status: EmployeeStatus | null;
  departmentId: string | null;
  positionId: string | null;
  page: number;
  size: number;
}
