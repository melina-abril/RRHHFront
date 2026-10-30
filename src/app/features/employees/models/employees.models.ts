import { BadgeTone } from '../../../shared/components/status-badge';
import { Page } from '../../../shared/models/page';

// Enums exactamente como en el backend
export type EmployeeCategory = 'PERMANENT' | 'INTERN';
export const EMPLOYEE_CATEGORY_OPTIONS: readonly { value: EmployeeCategory; label: string }[] = [
  { value: 'PERMANENT', label: 'Permanente' },
  { value: 'INTERN', label: 'Pasante' },
];
export const EMPLOYEE_CATEGORY: Record<EmployeeCategory, { label: string; tone: BadgeTone }> = {
  PERMANENT: { label: 'Permanente', tone: 'info' },
  INTERN: { label: 'Pasante', tone: 'success' },
};

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';
export const EMPLOYEE_STATUS_OPTIONS: readonly { value: EmployeeStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Activo' },
  { value: 'INACTIVE', label: 'Inactivo' },
];
export const EMPLOYEE_STATUS: Record<EmployeeStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Activo', tone: 'success' },
  INACTIVE: { label: 'Inactivo', tone: 'danger' },
};

// List item: conforme EmployeeListResponse del backend (GET /api/employees)
export interface EmployeeList {
  id: string;
  legajo: string;
  firstName: string;
  lastName: string;
  email: string;
  category: EmployeeCategory;
  status: EmployeeStatus;
  countryCode: string;
  city: string;
  entryDate: string;
  position: string;
  clients: string[];
  projects: string[];
  updatedAt: string;
}

// Paginado
export interface EmployeeFilters {
  search: string;
  legajo: string;
  category: EmployeeCategory | null;
  client: string;
  project: string;
  status: EmployeeStatus | null;
  page: number;
  size: number;
}

// Ficha individual: conforme EmployeeDetailsResponse (GET /api/employees/{id})
export interface EmployeeDetails {
  id: string;
  legajo: string;
  firstName: string;
  lastName: string;
  email: string;
  category: EmployeeCategory;
  status: EmployeeStatus;
  countryCode: string;
  city: string;
  entryDate: string;
  position: string;
  clients: string[];
  projects: string[];
  backgroundNotes: string[];
  updatedAt: string;
}

// Body del alta: CreateEmployeeRequest
export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  category: EmployeeCategory;
  countryCode: string;
  city: string;
  entryDate: string;
  position: string;
  clients: string[];
  projects: string[];
}
