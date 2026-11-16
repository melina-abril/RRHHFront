import { BadgeTone } from '../../../shared/components/status-badge';

export type EmployeeCategory = 'PERMANENT' | 'INTERN';
export type EmployeeDedication = 'FULL_TIME' | 'PART_TIME';
export type EmployeeWorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export interface EmployeeRequest {
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
  initialClient: string | null;
  initialProject: string | null;
  initialManager: string | null;
}

export interface EmployeeResponse extends EmployeeRequest {
  id: string;
  employeeNumber: string;
  status: EmployeeStatus;
  createdAt: string;
}

export const EMPLOYEE_STATUS: Record<EmployeeStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Activo', tone: 'success' },
  INACTIVE: { label: 'Inactivo', tone: 'neutral' },
};

export const EMPLOYEE_CATEGORY: Record<EmployeeCategory, string> = {
  PERMANENT: 'Permanente',
  INTERN: 'Pasante',
};
