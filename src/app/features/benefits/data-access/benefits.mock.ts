import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { BenefitAdjustmentRequest, BenefitBalanceResponse, BenefitBalancesResponse, BenefitMovementResponse } from '../models/benefits.models';

const balances: BenefitBalanceResponse[] = [
  { benefitType: 'VACATION', status: 'NOT_APPLICABLE', granted: null, used: null, available: null, expired: null, periodStart: null, periodEnd: null },
  { benefitType: 'DAYS_OFF', status: 'NOT_RECORDED', granted: null, used: null, available: null, expired: null, periodStart: null, periodEnd: null },
  { benefitType: 'STUDY_LEAVE', status: 'NOT_RECORDED', granted: null, used: null, available: null, expired: null, periodStart: null, periodEnd: null },
  { benefitType: 'MOVING_LEAVE', status: 'NOT_RECORDED', granted: null, used: null, available: null, expired: null, periodStart: null, periodEnd: null },
];

export function getBenefitBalancesMock(id: string): Observable<BenefitBalancesResponse> {
  if (id !== 'demo-employee') return mockError(404, 'No se encontró el legajo.');
  return mockResponse({ employeeId: id, employeeNumber: 'EMP-001', category: 'PERMANENT', balances: balances.map((balance) => ({ ...balance })) });
}

export function listBenefitMovementsMock(id: string): Observable<BenefitMovementResponse[]> {
  if (id !== 'demo-employee') return mockError(404, 'No se encontró el legajo.');
  return mockResponse([]);
}

export function createBenefitAdjustmentMock(id: string, request: BenefitAdjustmentRequest): Observable<BenefitMovementResponse> {
  if (id !== 'demo-employee') return mockError(404, 'No se encontró el legajo.');
  if (!Number.isInteger(request.amount) || request.amount === 0 || !request.reason.trim() || request.reason.length > 500) {
    return mockError(422, 'Revisa los datos del ajuste.', {
      amount: ['Ingresa una cantidad entera distinta de cero.'],
      reason: ['Ingresa una justificación de hasta 500 caracteres.'],
    });
  }
  return mockError(422, 'No se puede ajustar un beneficio sin saldo registrado.');
}
