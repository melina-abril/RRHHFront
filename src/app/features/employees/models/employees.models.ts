import { BadgeTone } from '../../../shared/components/status-badge';

export type EmployeeCategory = 'PERMANENT' | 'INTERN';
export type EmployeeDedication = 'FULL_TIME' | 'PART_TIME';
export type EmployeeWorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface Employee {
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

export interface EmployeeUpdateRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  residenceCountry: string;
  personalEmail: string;
  dedication: EmployeeDedication;
  workMode: EmployeeWorkMode;
  jobRole: string;
}

export interface EmployeeCreateRequest extends EmployeeUpdateRequest {
  startDate: string;
  category: EmployeeCategory;
  initialClient?: string | null;
  initialProject?: string | null;
  initialManager?: string | null;
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

export const EMPLOYEE_STATUS: Record<EmployeeStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Activo', tone: 'success' },
  INACTIVE: { label: 'Inactivo', tone: 'neutral' },
};
export const EMPLOYEE_CATEGORY: Record<EmployeeCategory, string> = {
  PERMANENT: 'Permanente',
  INTERN: 'Pasante',
};
export const EMPLOYEE_DEDICATION: Record<EmployeeDedication, string> = {
  FULL_TIME: 'Tiempo completo',
  PART_TIME: 'Tiempo parcial',
};
export const EMPLOYEE_WORK_MODE: Record<EmployeeWorkMode, string> = {
  REMOTE: 'Remota',
  HYBRID: 'Híbrida',
  ONSITE: 'Presencial',
};
