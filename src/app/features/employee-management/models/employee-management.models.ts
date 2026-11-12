import { BadgeTone } from '../../../shared/components/status-badge';

export type EmployeeCategory = 'PERMANENT' | 'INTERN';
export type EmployeeCommitment = 'FULL_TIME' | 'PART_TIME';
export type EmployeeWorkMode = 'REMOTE' | 'HYBRID' | 'ON_SITE';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  residenceCountry: string;
  personalEmail: string;
  hireDate: string;
  category: EmployeeCategory;
  commitment: EmployeeCommitment;
  workMode: EmployeeWorkMode;
  jobRole: string;
  clientName: string | null;
  projectName: string | null;
  contactName: string | null;
}

export interface EmployeeResponse extends EmployeeRequest {
  id: string;
  employeeNumber: string;
  status: EmployeeStatus;
  createdAt: string;
}

export interface EmployeeListQuery {
  search: string;
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

export const EMPLOYEE_COMMITMENT: Record<EmployeeCommitment, string> = {
  FULL_TIME: 'Tiempo completo',
  PART_TIME: 'Tiempo parcial',
};

export const EMPLOYEE_WORK_MODE: Record<EmployeeWorkMode, string> = {
  REMOTE: 'Remota',
  HYBRID: 'Híbrida',
  ON_SITE: 'Presencial',
};
