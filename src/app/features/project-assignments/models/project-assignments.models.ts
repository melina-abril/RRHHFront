import { BadgeTone } from '../../../shared/components/status-badge';
import { Page } from '../../../shared/models/page';

export interface ClientDto { id: string; name: string; active: boolean; createdAt: string; }
export interface ClientRequest { name: string; active: boolean; }
export interface ClientCountryDto { id: string; clientId: string; countryCode: string; countryName: string; createdAt: string; }
export interface ClientCountryRequest { countryCode: string; countryName: string; }
export interface ProjectDto { id: string; clientId: string; name: string; clientCountryIds: string[]; active: boolean; createdAt: string; }
export interface ProjectRequest { clientId: string; name: string; clientCountryIds: string[]; active: boolean; }
export interface ProjectContactDto { id: string; projectId: string; name: string; email: string; active: boolean; createdAt: string; }
export interface ProjectContactRequest { name: string; email: string; active: boolean; }
export type AssignmentStatus = 'ACTIVE' | 'ENDED';
export type AssignmentAction = 'CREATED' | 'UPDATED' | 'ENDED';
export interface AssignmentValuesDto {
  employeeId: string; clientId: string; clientName: string; projectId: string; projectName: string;
  clientCountryId: string; countryName: string; contactId: string | null; contactName: string | null;
  role: string; startDate: string; endDate: string | null; status: AssignmentStatus;
}
export interface AssignmentEventDto {
  id: string; assignmentId: string; action: AssignmentAction; actorUserId: string;
  occurredAt: string; beforeValues: AssignmentValuesDto | null; afterValues: AssignmentValuesDto; createdAt: string;
}
export interface AssignmentDto extends AssignmentValuesDto { id: string; createdAt: string; updatedAt: string; history: AssignmentEventDto[]; }
export interface EmployeeAssignmentsDto { active: AssignmentDto[]; ended: AssignmentDto[]; }
export interface AssignmentRequest {
  clientId: string; clientCountryId: string; projectId: string; contactId: string | null;
  role: string; startDate: string; endDate: string | null;
}
export interface FinalizeAssignmentRequest { endDate: string; }
export interface PageQuery { page: number; size: number; }
export interface ProjectQuery extends PageQuery { clientId?: string; clientCountryId?: string; }
export type ClientPage = Page<ClientDto>;
export const ASSIGNMENT_STATUS: Record<AssignmentStatus, { label: string; tone: BadgeTone }> = {
  ACTIVE: { label: 'Vigente', tone: 'success' },
  ENDED: { label: 'Terminada', tone: 'neutral' },
};
