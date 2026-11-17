import { BadgeTone } from '../../../shared/components/status-badge';

export type EmployeeCategory = 'PERMANENT' | 'INTERN';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';
export type EmployeeDedication = 'FULL_TIME' | 'PART_TIME';
export type EmployeeWorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';

export interface EmployeeResponse {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  residenceCountry: string;
  personalEmail: string;
  startDate: string;
  category: EmployeeCategory;
  dedication: EmployeeDedication;
  workMode: EmployeeWorkMode;
  jobRole: string;
  status: EmployeeStatus;
  initialClient: string | null;
  initialProject: string | null;
  initialManager: string | null;
  createdById: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface UpdateEmployeeRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  residenceCountry: string;
  personalEmail: string;
  dedication: EmployeeDedication;
  workMode: EmployeeWorkMode;
  jobRole: string;
}

export interface EmployeeFilters {
  search: string;
  category: EmployeeCategory | null;
  client: string;
  project: string;
  status: EmployeeStatus | null;
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
export const EMPLOYEE_DEDICATIONS: Record<EmployeeDedication, string> = {
  FULL_TIME: 'Tiempo completo',
  PART_TIME: 'Tiempo parcial',
};
export const EMPLOYEE_WORK_MODES: Record<EmployeeWorkMode, string> = {
  REMOTE: 'Remota',
  HYBRID: 'Híbrida',
  ONSITE: 'Presencial',
};
