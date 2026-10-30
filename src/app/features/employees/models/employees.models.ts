import { BadgeTone } from '../../../shared/components/status-badge';
import { Page } from '../../../shared/models/page';

export type EmployeeCategory = 'PERMANENT' | 'INTERN';
export type EmployeeWorkMode = 'ON_SITE' | 'REMOTE' | 'HYBRID';
export type EmployeeDedication = 'FULL_TIME' | 'PART_TIME';
export type EmployeeState = 'ACTIVE' | 'INACTIVE';

export interface Employee {
  id: string;
  legajo: string;
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  country: string;
  birthDate: string;
  personalEmail: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
  category: EmployeeCategory;
  workMode: EmployeeWorkMode;
  dedication: EmployeeDedication;
  role: string;
  joinDate: string;
  state: EmployeeState;
  client: string | null;
  project: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFilters {
  search: string;
  legajo: string;
  category: EmployeeCategory | null;
  client: string | null;
  project: string | null;
  state: EmployeeState | null;
  page: number;
  size: number;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  country: string;
  birthDate: string;
  personalEmail: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
  category: EmployeeCategory;
  workMode: EmployeeWorkMode;
  dedication: EmployeeDedication;
  role: string;
  joinDate: string;
  client: string | null;
  project: string | null;
}

export interface UpdateEmployeeRequest {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
  country: string;
  birthDate: string;
  personalEmail: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
  category: EmployeeCategory;
  workMode: EmployeeWorkMode;
  dedication: EmployeeDedication;
  role: string;
  joinDate: string;
  client: string | null;
  project: string | null;
}

export const EMPLOYEE_CATEGORY: Record<EmployeeCategory, { label: string; tone: BadgeTone }> = {
  PERMANENT: { label: 'Permanente', tone: 'success' },
  INTERN: { label: 'Pasante', tone: 'info' }
};

export const EMPLOYEE_CATEGORY_OPTIONS: readonly { value: EmployeeCategory; label: string }[] = (
  Object.keys(EMPLOYEE_CATEGORY) as EmployeeCategory[]
).map((value) => ({ value, label: EMPLOYEE_CATEGORY[value].label }));

export const EMPLOYEE_WORK_MODE: Record<EmployeeWorkMode, { label: string; tone: BadgeTone }> = {
  ON_SITE: { label: 'Presencial', tone: 'info' },
  REMOTE: { label: 'Remota', tone: 'info' },
  HYBRID: { label: 'Híbrida', tone: 'info' }
};

export const EMPLOYEE_WORK_MODE_OPTIONS: readonly { value: EmployeeWorkMode; label: string }[] = (
  Object.keys(EMPLOYEE_WORK_MODE) as EmployeeWorkMode[]
).map((value) => ({ value, label: EMPLOYEE_WORK_MODE[value].label }));

export const EMPLOYEE_DEDICATION: Record<EmployeeDedication, { label: string; tone: BadgeTone }> = {
  FULL_TIME: { label: 'Full time', tone: 'neutral' },
  PART_TIME: { label: 'Part time', tone: 'neutral' }
};

export const EMPLOYEE_DEDICATION_OPTIONS: readonly { value: EmployeeDedication; label: string }[] = (
  Object.keys(EMPLOYEE_DEDICATION) as EmployeeDedication[]
).map((value) => ({ value, label: EMPLOYEE_DEDICATION[value].label }));

export const EMPLOYEE_STATE: Record<EmployeeState, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Activo', tone: 'success' },
  INACTIVE: { label: 'Inactivo', tone: 'danger' }
};

export const EMPLOYEE_STATE_OPTIONS: readonly { value: EmployeeState; label: string }[] = (
  Object.keys(EMPLOYEE_STATE) as EmployeeState[]
).map((value) => ({ value, label: EMPLOYEE_STATE[value].label }));
