import { BadgeTone } from '../../../shared/components/status-badge';

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface EmployeeDto {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
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

export interface EmployeesFilters {
  search: string | null;
  status: EmployeeStatus | null;
  departmentId: string | null;
  positionId: string | null;
}

export interface EmployeesPageQuery extends EmployeesFilters {
  page: number;
  size: number;
}

export const EMPLOYEE_STATUS: Record<EmployeeStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Activo', tone: 'success' },
  ON_LEAVE: { label: 'De licencia', tone: 'warning' },
  TERMINATED: { label: 'Inactivo', tone: 'danger' },
};

export const EMPLOYEE_STATUS_OPTIONS: readonly { value: EmployeeStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'ON_LEAVE', label: 'De licencia' },
  { value: 'TERMINATED', label: 'Inactivo' },
];
