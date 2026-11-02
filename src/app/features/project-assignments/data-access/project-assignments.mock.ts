import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { Page, toPage } from '../../../shared/models/page';
import { AssignmentDto, AssignmentEventDto, AssignmentRequest, AssignmentValuesDto, ClientCountryDto, ClientCountryRequest, ClientDto, ClientRequest, EmployeeAssignmentsDto, FinalizeAssignmentRequest, PageQuery, ProjectContactDto, ProjectContactRequest, ProjectDto, ProjectQuery, ProjectRequest } from '../models/project-assignments.models';

const createdAt = '2026-01-15T12:00:00Z';
let clients: ClientDto[] = [
  { id: 'c1', name: 'Grupo Andino', active: true, createdAt },
  { id: 'c2', name: 'SaludNova', active: true, createdAt },
  { id: 'c3', name: 'Río Logística', active: true, createdAt },
  { id: 'c4', name: 'Cooperativa Horizonte', active: true, createdAt },
  { id: 'c5', name: 'Nexo Retail', active: true, createdAt },
];
let countries: ClientCountryDto[] = [
  { id: 'ar', clientId: 'c1', countryCode: 'AR', countryName: 'Argentina', createdAt },
  { id: 'cl', clientId: 'c1', countryCode: 'CL', countryName: 'Chile', createdAt },
  { id: 'uy', clientId: 'c1', countryCode: 'UY', countryName: 'Uruguay', createdAt },
  { id: 'mx', clientId: 'c2', countryCode: 'MX', countryName: 'México', createdAt },
];
let projects: ProjectDto[] = [
  { id: 'p1', clientId: 'c1', name: 'Portal de clientes', clientCountryIds: ['ar'], active: true, createdAt },
  { id: 'p2', clientId: 'c1', name: 'Motor de pagos', clientCountryIds: ['cl'], active: true, createdAt },
  { id: 'p3', clientId: 'c1', name: 'Analítica comercial', clientCountryIds: ['ar'], active: true, createdAt },
  { id: 'p4', clientId: 'c1', name: 'Integraciones ERP', clientCountryIds: ['uy'], active: true, createdAt },
  { id: 'p5', clientId: 'c1', name: 'App de sucursales', clientCountryIds: ['cl'], active: false, createdAt },
  { id: 'p6', clientId: 'c2', name: 'Historia clínica', clientCountryIds: ['mx'], active: true, createdAt },
];
let contacts: ProjectContactDto[] = [
  { id: 'r1', projectId: 'p1', name: 'Lucía Fernández', email: 'lucia@example.invalid', active: true, createdAt },
  { id: 'r2', projectId: 'p1', name: 'Martín Costa', email: 'martin@example.invalid', active: true, createdAt },
  { id: 'r3', projectId: 'p2', name: 'Camila Rojas', email: 'camila@example.invalid', active: true, createdAt },
  { id: 'r4', projectId: 'p4', name: 'Valentina Silva', email: 'valentina@example.invalid', active: true, createdAt },
];
let assignments: AssignmentDto[] = [];
const missing = (): Observable<never> => mockError(404, 'No se encontró el registro solicitado');
const paged = <T>(items: T[], query: PageQuery): Observable<Page<T>> => mockResponse(toPage(items, query.page, query.size));

export function listClientsMock(query: PageQuery): Observable<Page<ClientDto>> { return paged(clients, query); }
export function createClientMock(request: ClientRequest): Observable<ClientDto> {
  if (!request.name.trim()) return mockError(422, 'Revisá los datos indicados', { name: ['Ingresa el nombre.'] });
  if (clients.some(c => c.name.toLowerCase() === request.name.trim().toLowerCase())) return mockError(409, 'Revisá los datos indicados', { name: ['El cliente ya existe.'] });
  const item: ClientDto = { ...request, name: request.name.trim(), id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  clients = [...clients, item]; return mockResponse(item);
}
export function listClientCountriesMock(clientId: string, query: PageQuery): Observable<Page<ClientCountryDto>> {
  return clients.some(c => c.id === clientId) ? paged(countries.filter(c => c.clientId === clientId), query) : missing();
}
export function addClientCountryMock(clientId: string, request: ClientCountryRequest): Observable<ClientCountryDto> {
  if (!clients.some(c => c.id === clientId)) return missing();
  if (!request.countryCode.trim() || !request.countryName.trim()) return mockError(422, 'Revisá los datos indicados');
  if (countries.some(c => c.clientId === clientId && c.countryCode === request.countryCode.toUpperCase())) return mockError(409, 'Revisá los datos indicados', { countryCode: ['El país ya está vinculado.'] });
  const item: ClientCountryDto = { ...request, countryCode: request.countryCode.toUpperCase(), clientId, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  countries = [...countries, item]; return mockResponse(item);
}
export function listProjectsMock(query: ProjectQuery): Observable<Page<ProjectDto>> {
  return paged(projects.filter(p => (!query.clientId || p.clientId === query.clientId) && (!query.clientCountryId || p.clientCountryIds.includes(query.clientCountryId))), query);
}
export function createProjectMock(request: ProjectRequest): Observable<ProjectDto> {
  if (!clients.some(c => c.id === request.clientId)) return missing();
  if (!request.name.trim() || !request.clientCountryIds.length || request.clientCountryIds.some(id => !countries.some(c => c.id === id && c.clientId === request.clientId))) return mockError(422, 'Revisá los datos indicados');
  if (projects.some(p => p.clientId === request.clientId && p.name.toLowerCase() === request.name.trim().toLowerCase())) return mockError(409, 'Revisá los datos indicados', { name: ['El proyecto ya existe.'] });
  const item: ProjectDto = { ...request, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  projects = [...projects, item]; return mockResponse(item);
}
export function listProjectContactsMock(projectId: string, query: PageQuery): Observable<Page<ProjectContactDto>> {
  return projects.some(p => p.id === projectId) ? paged(contacts.filter(c => c.projectId === projectId), query) : missing();
}
export function createProjectContactMock(projectId: string, request: ProjectContactRequest): Observable<ProjectContactDto> {
  if (!projects.some(p => p.id === projectId)) return missing();
  if (!request.name.trim() || !/^\S+@\S+\.\S+$/.test(request.email)) return mockError(422, 'Revisá los datos indicados', { email: ['Ingresa un correo válido.'] });
  if (contacts.some(c => c.projectId === projectId && c.email === request.email)) return mockError(409, 'Revisá los datos indicados', { email: ['El referente ya existe.'] });
  const item: ProjectContactDto = { ...request, projectId, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  contacts = [...contacts, item]; return mockResponse(item);
}
export function listEmployeeAssignmentsMock(employeeId: string): Observable<EmployeeAssignmentsDto> {
  if (!employeeId.trim()) return missing();
  const own = assignments.filter(a => a.employeeId === employeeId);
  return mockResponse({ active: own.filter(a => a.status === 'ACTIVE'), ended: own.filter(a => a.status === 'ENDED') });
}
function values(employeeId: string, request: AssignmentRequest): AssignmentValuesDto | null {
  const client = clients.find(c => c.id === request.clientId);
  const country = countries.find(c => c.id === request.clientCountryId && c.clientId === client?.id);
  const project = projects.find(p => p.id === request.projectId && p.clientId === client?.id && p.clientCountryIds.includes(request.clientCountryId));
  const contact = request.contactId ? contacts.find(c => c.id === request.contactId && c.projectId === project?.id) : null;
  if (!client?.active || !country || !project?.active || (request.contactId && !contact) || !request.role.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(request.startDate) || (request.endDate !== null && (request.endDate < request.startDate || !/^\d{4}-\d{2}-\d{2}$/.test(request.endDate)))) return null;
  return { employeeId, clientId: client.id, clientName: client.name, projectId: project.id, projectName: project.name, clientCountryId: country.id, countryName: country.countryName, contactId: contact?.id ?? null, contactName: contact?.name ?? null, role: request.role.trim(), startDate: request.startDate, endDate: request.endDate, status: request.endDate ? 'ENDED' : 'ACTIVE' };
}
function event(id: string, action: AssignmentEventDto['action'], beforeValues: AssignmentValuesDto | null, afterValues: AssignmentValuesDto): AssignmentEventDto {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), assignmentId: id, action, actorUserId: 'demo', occurredAt: now, beforeValues, afterValues, createdAt: now };
}
function before(item: AssignmentDto): AssignmentValuesDto {
  const { employeeId, clientId, clientName, projectId, projectName, clientCountryId, countryName, contactId, contactName, role, startDate, endDate, status } = item;
  return { employeeId, clientId, clientName, projectId, projectName, clientCountryId, countryName, contactId, contactName, role, startDate, endDate, status };
}
export function createEmployeeAssignmentMock(employeeId: string, request: AssignmentRequest): Observable<AssignmentDto> {
  if (!employeeId.trim()) return missing();
  const next = values(employeeId, request);
  if (!next) return mockError(422, 'Revisá los datos indicados');
  if (next.status === 'ACTIVE' && assignments.some(a => a.employeeId === employeeId && a.projectId === next.projectId && a.clientCountryId === next.clientCountryId && a.status === 'ACTIVE')) return mockError(409, 'Revisá los datos indicados', { projectId: ['Ya existe una asignación vigente para este proyecto y país.'] });
  const id = crypto.randomUUID(); const now = new Date().toISOString();
  const item: AssignmentDto = { ...next, id, createdAt: now, updatedAt: now, history: [event(id, 'CREATED', null, next)] };
  assignments = [...assignments, item]; return mockResponse(item);
}
export function updateEmployeeAssignmentMock(employeeId: string, id: string, request: AssignmentRequest): Observable<AssignmentDto> {
  const current = assignments.find(a => a.id === id && a.employeeId === employeeId);
  if (!current) return missing();
  if (current.status !== 'ACTIVE' || request.clientId !== current.clientId || request.projectId !== current.projectId) return mockError(422, 'Revisá los datos indicados');
  const next = values(employeeId, request);
  if (!next) return mockError(422, 'Revisá los datos indicados');
  if (next.status === 'ACTIVE' && assignments.some(a => a.id !== id && a.employeeId === employeeId && a.projectId === next.projectId && a.clientCountryId === next.clientCountryId && a.status === 'ACTIVE')) return mockError(409, 'Revisá los datos indicados');
  const updated: AssignmentDto = { ...current, ...next, updatedAt: new Date().toISOString(), history: [...current.history, event(id, 'UPDATED', before(current), next)] };
  assignments = assignments.map(a => a.id === id ? updated : a); return mockResponse(updated);
}
export function finalizeEmployeeAssignmentMock(employeeId: string, id: string, request: FinalizeAssignmentRequest): Observable<AssignmentDto> {
  const current = assignments.find(a => a.id === id && a.employeeId === employeeId);
  if (!current) return missing();
  if (current.status !== 'ACTIVE' || !/^\d{4}-\d{2}-\d{2}$/.test(request.endDate) || request.endDate < current.startDate) return mockError(422, 'Revisá los datos indicados', { endDate: ['Ingresa una fecha válida, no anterior al inicio.'] });
  const next: AssignmentValuesDto = { ...before(current), endDate: request.endDate, status: 'ENDED' };
  const updated: AssignmentDto = { ...current, ...next, updatedAt: new Date().toISOString(), history: [...current.history, event(id, 'ENDED', before(current), next)] };
  assignments = assignments.map(a => a.id === id ? updated : a); return mockResponse(updated);
}
