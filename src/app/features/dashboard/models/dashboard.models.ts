/** Respuesta de GET /api/dashboard/summary. */
export interface DashboardSummaryResponse {
  activeEmployees: number;
  pendingRequests: number;
  upcomingEvents: number;
}
