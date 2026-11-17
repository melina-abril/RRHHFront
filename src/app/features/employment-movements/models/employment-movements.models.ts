import { BadgeTone } from '../../../shared/components/status-badge';

export type EmploymentCategory = 'INTERN' | 'PERMANENT';
export type EmploymentStatus = 'ACTIVE' | 'INACTIVE';
export type MovementType = 'HIRE' | 'CATEGORY_CHANGE' | 'DEPARTURE' | 'REHIRE';

export interface CategoryChangeRequest {
  effectiveDate: string;
  category: EmploymentCategory;
  reason: string;
}

export interface DepartureRequest {
  effectiveDate: string;
  reason: string;
}

export interface RehireRequest {
  effectiveDate: string;
  category: EmploymentCategory;
  reason: string;
}

export interface EmploymentMovementResponse {
  id: string;
  type: MovementType;
  effectiveDate: string;
  previousCategory: EmploymentCategory | null;
  category: EmploymentCategory;
  previousStatus: EmploymentStatus | null;
  status: EmploymentStatus;
  reason: string | null;
  recordedById: string;
  recordedAt: string;
}

export interface EmploymentMovementsResponse {
  employeeId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  category: EmploymentCategory;
  status: EmploymentStatus;
  startDate: string;
  movements: EmploymentMovementResponse[];
}

export type EmploymentAction = 'CATEGORY_CHANGE' | 'DEPARTURE' | 'REHIRE';

export const CATEGORY_INFO: Record<EmploymentCategory, { label: string; tone: BadgeTone }> = {
  INTERN: { label: 'Pasante', tone: 'info' },
  PERMANENT: { label: 'Permanente', tone: 'info' },
};

export const STATUS_INFO: Record<EmploymentStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Activo', tone: 'success' },
  INACTIVE: { label: 'Inactivo', tone: 'danger' },
};

export const MOVEMENT_INFO: Record<MovementType, string> = {
  HIRE: 'Ingreso',
  CATEGORY_CHANGE: 'Pase a permanente',
  DEPARTURE: 'Egreso',
  REHIRE: 'Reingreso',
};
