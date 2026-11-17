import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { RemunerationHistoryResponse, RemunerationPeriodResponse, RemunerationRequest } from '../models/remuneration.models';

const histories: Record<string, RemunerationPeriodResponse[]> = {
  'e-1001': [
    { id: 'salary-3', amount: 1900000, currency: 'ARS', effectiveDate: '2026-03-01', reason: 'Ajuste anual', registeredById: 'demo-admin', registeredAt: '2026-02-25T14:00:00Z', status: 'CURRENT', internSupplement: 0 },
    { id: 'salary-2', amount: 1750000, currency: 'ARS', effectiveDate: '2025-10-01', reason: 'Revisión salarial', registeredById: 'demo-admin', registeredAt: '2025-09-25T13:00:00Z', status: 'HISTORICAL', internSupplement: 0 },
    { id: 'salary-1', amount: 1000000, currency: 'ARS', effectiveDate: '2024-10-01', reason: 'Remuneración inicial', registeredById: 'demo-admin', registeredAt: '2024-09-28T11:00:00Z', status: 'HISTORICAL', internSupplement: 10000 },
  ],
  'e-1002': [],
};

function notFound(): Observable<never> {
  return mockError(404, 'No se encontró el colaborador.');
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function withStatuses(periods: readonly RemunerationPeriodResponse[]): RemunerationPeriodResponse[] {
  const sorted = [...periods].sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate));
  const today = new Date().toISOString().slice(0, 10);
  const currentId = sorted.find((period) => period.effectiveDate <= today)?.id;
  return sorted.map((period) => ({
    ...period,
    status: period.effectiveDate > today ? 'SCHEDULED' : period.id === currentId ? 'CURRENT' : 'HISTORICAL',
  }));
}

export function listRemunerationPeriodsMock(id: string): Observable<RemunerationHistoryResponse> {
  const periods = histories[id];
  if (!periods) return notFound();
  return mockResponse({ employeeId: id, periods: withStatuses(periods) });
}

export function createRemunerationPeriodMock(id: string, request: RemunerationRequest): Observable<RemunerationPeriodResponse> {
  const periods = histories[id];
  if (!periods) return notFound();
  if (!Number.isFinite(request.amount) || request.amount <= 0 || !Number.isInteger(request.amount * 100)) {
    return mockError(422, 'Revisa el importe base.', { amount: ['Ingresa un importe positivo con hasta dos decimales.'] });
  }
  if (!['ARS', 'MXN', 'USD'].includes(request.currency)) {
    return mockError(422, 'Selecciona una moneda válida.', { currency: ['Selecciona una moneda válida.'] });
  }
  if (!validDate(request.effectiveDate)) {
    return mockError(422, 'Revisa la fecha de vigencia.', { effectiveDate: ['Ingresa una fecha válida.'] });
  }
  if (!request.reason.trim() || request.reason.trim().length > 500) {
    return mockError(422, 'Revisa el motivo.', { reason: ['Ingresa un motivo de hasta 500 caracteres.'] });
  }
  if (periods.some((period) => period.effectiveDate === request.effectiveDate)) {
    return mockError(409, 'Ya existe una vigencia para esa fecha.', { effectiveDate: ['Ya existe una vigencia para esa fecha.'] });
  }
  const period: RemunerationPeriodResponse = {
    ...request,
    reason: request.reason.trim(),
    id: `salary-${Date.now()}`,
    registeredById: 'demo-admin',
    registeredAt: new Date().toISOString(),
    status: 'SCHEDULED',
    internSupplement: 0,
  };
  histories[id] = [period, ...periods];
  return mockResponse(withStatuses(histories[id]).find((item) => item.id === period.id) ?? period);
}
