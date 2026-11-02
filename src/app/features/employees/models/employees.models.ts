import { BadgeTone } from '../../../shared/components/status-badge';
import { Page } from '../../../shared/models/page';

/** Estados posibles de un colaborador. */
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

export const EMPLOYEE_STATUS: Record<EmployeeStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Activo', tone: 'success' },
  INACTIVE: { label: 'Inactivo', tone: 'danger' },
};

export const EMPLOYEE_STATUS_OPTIONS: readonly { value: EmployeeStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
];

/** Categorías internas de la empresa. */
export type EmployeeCategory = 'PASANTE' | 'PERMANENTE';
export const EMPLOYEE_CATEGORIES: readonly { value: EmployeeCategory; label: string }[] = [
  { value: 'PASANTE', label: 'Pasante' },
  { value: 'PERMANENTE', label: 'Permanente' },
];

/** Datos de un colaborador */
export interface Employee {
  id: string;
  legajo: string;
  firstName: string;
  lastName: string;
  category: EmployeeCategory;
  status: EmployeeStatus;
  client: string | null;
  project: string | null;
  position: string;
  hireDate: string; // ISO 8601
  email: string;
  phone: string;
  documentType: string;
  documentNumber: string;
}

/** Datos completos de un colaborador para la ficha */
export interface EmployeeDetail extends Employee {
  nationality: string;
  residenceCountry: string;
  address: string;
  birthDate: string;
  emergencyContact: string;
  emergencyPhone: string;
  corporateEmail: string;
  department: string;
  team: string;
  manager: string;
  updatedAt: string;
}

/** Filtros y paginación en el listado */
export interface EmployeeFilters {
  search: string;
  status: EmployeeStatus | null;
  category: EmployeeCategory | null;
  client: string | null;
  project: string | null;
  page: number;
  size: number;
}

/** Estado informativo "Todos los registros" */
export function isShowingAllRecords(filters: EmployeeFilters): boolean {
  return !filters.search && !filters.status && !filters.category && !filters.client && !filters.project;
}
