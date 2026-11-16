/** Campos y valores del contrato GET /api/dashboard/summary. */
export interface DashboardEventResponse {
  type: 'BIRTHDAY';
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  date: string;
}

export interface DashboardSummaryResponse {
  activeEmployees: number;
  pendingRequests: null;
  pendingRequestsMessage: string;
  upcomingEvents: DashboardEventResponse[];
}
