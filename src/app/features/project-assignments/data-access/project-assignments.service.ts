import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { Page } from '../../../shared/models/page';
import { AssignmentDto, AssignmentRequest, ClientCountryDto, ClientCountryRequest, ClientDto, ClientRequest, EmployeeAssignmentsDto, FinalizeAssignmentRequest, PageQuery, ProjectContactDto, ProjectContactRequest, ProjectDto, ProjectQuery, ProjectRequest } from '../models/project-assignments.models';
import { addClientCountryMock, createClientMock, createEmployeeAssignmentMock, createProjectContactMock, createProjectMock, finalizeEmployeeAssignmentMock, listClientCountriesMock, listClientsMock, listEmployeeAssignmentsMock, listProjectContactsMock, listProjectsMock, updateEmployeeAssignmentMock } from './project-assignments.mock';

const base = '/api/project-assignments';
function pageParams(query: PageQuery): HttpParams { return new HttpParams().set('page', query.page).set('size', query.size); }
@Injectable({ providedIn: 'root' })
export class ProjectAssignmentsService {
  private readonly http = inject(HttpClient);
  listClients(query: PageQuery): Observable<Page<ClientDto>> {
    return environment.useMock ? listClientsMock(query) : this.http.get<Page<ClientDto>>(apiUrl(`${base}/clients`), { params: pageParams(query) });
  }
  createClient(request: ClientRequest): Observable<ClientDto> {
    return environment.useMock ? createClientMock(request) : this.http.post<ClientDto>(apiUrl(`${base}/clients`), request);
  }
  listClientCountries(clientId: string, query: PageQuery): Observable<Page<ClientCountryDto>> {
    return environment.useMock ? listClientCountriesMock(clientId, query) : this.http.get<Page<ClientCountryDto>>(apiUrl(`${base}/clients/${encodeURIComponent(clientId)}/countries`), { params: pageParams(query) });
  }
  addClientCountry(clientId: string, request: ClientCountryRequest): Observable<ClientCountryDto> {
    return environment.useMock ? addClientCountryMock(clientId, request) : this.http.post<ClientCountryDto>(apiUrl(`${base}/clients/${encodeURIComponent(clientId)}/countries`), request);
  }
  listProjects(query: ProjectQuery): Observable<Page<ProjectDto>> {
    if (environment.useMock) return listProjectsMock(query);
    let params = pageParams(query);
    if (query.clientId) params = params.set('clientId', query.clientId);
    if (query.clientCountryId) params = params.set('clientCountryId', query.clientCountryId);
    return this.http.get<Page<ProjectDto>>(apiUrl(`${base}/projects`), { params });
  }
  createProject(request: ProjectRequest): Observable<ProjectDto> {
    return environment.useMock ? createProjectMock(request) : this.http.post<ProjectDto>(apiUrl(`${base}/projects`), request);
  }
  listProjectContacts(projectId: string, query: PageQuery): Observable<Page<ProjectContactDto>> {
    return environment.useMock ? listProjectContactsMock(projectId, query) : this.http.get<Page<ProjectContactDto>>(apiUrl(`${base}/projects/${encodeURIComponent(projectId)}/contacts`), { params: pageParams(query) });
  }
  createProjectContact(projectId: string, request: ProjectContactRequest): Observable<ProjectContactDto> {
    return environment.useMock ? createProjectContactMock(projectId, request) : this.http.post<ProjectContactDto>(apiUrl(`${base}/projects/${encodeURIComponent(projectId)}/contacts`), request);
  }
  listEmployeeAssignments(employeeId: string): Observable<EmployeeAssignmentsDto> {
    return environment.useMock ? listEmployeeAssignmentsMock(employeeId) : this.http.get<EmployeeAssignmentsDto>(apiUrl(`${base}/employees/${encodeURIComponent(employeeId)}`));
  }
  createEmployeeAssignment(employeeId: string, request: AssignmentRequest): Observable<AssignmentDto> {
    return environment.useMock ? createEmployeeAssignmentMock(employeeId, request) : this.http.post<AssignmentDto>(apiUrl(`${base}/employees/${encodeURIComponent(employeeId)}`), request);
  }
  updateEmployeeAssignment(employeeId: string, id: string, request: AssignmentRequest): Observable<AssignmentDto> {
    return environment.useMock ? updateEmployeeAssignmentMock(employeeId, id, request) : this.http.put<AssignmentDto>(apiUrl(`${base}/employees/${encodeURIComponent(employeeId)}/${encodeURIComponent(id)}`), request);
  }
  finalizeEmployeeAssignment(employeeId: string, id: string, request: FinalizeAssignmentRequest): Observable<AssignmentDto> {
    return environment.useMock ? finalizeEmployeeAssignmentMock(employeeId, id, request) : this.http.post<AssignmentDto>(apiUrl(`${base}/employees/${encodeURIComponent(employeeId)}/${encodeURIComponent(id)}/finalize`), request);
  }
}
