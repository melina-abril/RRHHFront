import { BadgeTone } from '../../../shared/components/status-badge';

export type RemunerationCurrency = 'ARS' | 'MXN' | 'USD';
export type RemunerationPeriodStatus = 'SCHEDULED' | 'CURRENT' | 'HISTORICAL';

export interface RemunerationRequest {
  amount: number;
  currency: RemunerationCurrency;
  effectiveDate: string;
  reason: string;
}

export interface RemunerationPeriodResponse {
  id: string;
  amount: number;
  currency: RemunerationCurrency;
  effectiveDate: string;
  reason: string;
  registeredById: string;
  registeredAt: string;
  status: RemunerationPeriodStatus;
  internSupplement: number;
}

export interface RemunerationHistoryResponse {
  employeeId: string;
  periods: RemunerationPeriodResponse[];
}

export const REMUNERATION_STATUS: Record<RemunerationPeriodStatus, { label: string; tone: BadgeTone }> = {
  SCHEDULED: { label: 'Programada', tone: 'info' },
  CURRENT: { label: 'Vigente', tone: 'success' },
  HISTORICAL: { label: 'Histórica', tone: 'neutral' },
};

export const REMUNERATION_CURRENCIES: readonly RemunerationCurrency[] = ['ARS', 'MXN', 'USD'];
