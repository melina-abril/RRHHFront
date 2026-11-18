import { BadgeTone } from '../../../shared/components/status-badge';

export type EmployeeCategory = 'PERMANENT' | 'INTERN';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  category: EmployeeCategory;
  country: string;
  position: string;
  clientNames: string[];
  projectNames: string[];
  status: EmployeeStatus;
  hireDate: string;
  terminationDate: string | null;
}

export interface EmployeeCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  category: EmployeeCategory;
  country: string;
  position: string;
  clientNames: string[];
  projectNames: string[];
  hireDate: string;
}

export interface EmployeeFilters {
  search: string;
  category: EmployeeCategory | null;
  status: EmployeeStatus | null;
  country: string;
  client: string;
  project: string;
  page: number;
  size: number;
}

export const EMPLOYEE_CATEGORIES: Record<EmployeeCategory, string> = {
  PERMANENT: 'Permanente',
  INTERN: 'Pasante',
};

export const EMPLOYEE_STATUSES: Record<EmployeeStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Activo', tone: 'success' },
  INACTIVE: { label: 'Inactivo', tone: 'neutral' },
};
