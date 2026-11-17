export type BenefitType = 'VACATION' | 'DAYS_OFF' | 'STUDY_LEAVE' | 'MOVING_LEAVE';
export type BenefitStatus = 'NOT_APPLICABLE' | 'NOT_RECORDED';
export type EmployeeCategory = 'PERMANENT' | 'INTERN';

export interface BenefitAdjustmentRequest {
  benefitType: BenefitType;
  amount: number;
  reason: string;
}

export interface BenefitBalanceResponse {
  benefitType: BenefitType;
  status: BenefitStatus;
  granted: number | null;
  used: number | null;
  available: number | null;
  expired: number | null;
  periodStart: string | null;
  periodEnd: string | null;
}

export interface BenefitBalancesResponse {
  employeeId: string;
  employeeNumber: string;
  category: EmployeeCategory;
  balances: BenefitBalanceResponse[];
}

export interface BenefitMovementResponse {
  id: string;
  benefitType: BenefitType;
  amount: number;
  resultingBalance: number;
  reason: string;
  occurredAt: string;
  createdById: string;
}

export const BENEFIT_LABELS: Record<BenefitType, string> = {
  VACATION: 'Vacaciones',
  DAYS_OFF: 'Días off',
  STUDY_LEAVE: 'Licencia por estudio',
  MOVING_LEAVE: 'Licencia por mudanza',
};

export const CATEGORY_LABELS: Record<EmployeeCategory, string> = {
  PERMANENT: 'Permanente',
  INTERN: 'Pasante',
};

export const BENEFIT_STATUSES: Record<BenefitStatus, string> = {
  NOT_APPLICABLE: 'No aplica',
  NOT_RECORDED: 'Sin saldo registrado',
};
