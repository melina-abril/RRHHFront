import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { of, switchMap, tap } from 'rxjs';
import { ApiProblemError } from '../../../../core/http/api-error';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { ProjectAssignmentsService } from '../../data-access/project-assignments.service';
import { AssignmentDto, ClientCountryDto, ClientDto, EmployeeAssignmentsDto, ProjectContactDto, ProjectDto } from '../../models/project-assignments.models';

@Component({ selector: 'app-assignment-form-page', imports: [RouterLink, ReactiveFormsModule, PageHeader, LoadingState, ErrorAlert, EmptyState], templateUrl: './assignment-form-page.html', styleUrl: './assignment-form-page.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class AssignmentFormPage {
  readonly employeeId = input.required<string>();
  readonly id = input<string>();
  private readonly service = inject(ProjectAssignmentsService);
  private readonly router = inject(Router);
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly serverErrors = signal<Record<string, string[]>>({});
  protected readonly selectedClient = signal('');
  protected readonly selectedCountry = signal('');
  protected readonly selectedProject = signal('');
  protected readonly isEdit = computed(() => !!this.id());
  protected readonly form = inject(NonNullableFormBuilder).group({
    clientId: ['', Validators.required], clientCountryId: ['', Validators.required], projectId: ['', Validators.required],
    contactId: [''], role: ['', Validators.required], startDate: ['', Validators.required], endDate: [''],
  });
  protected readonly assignmentState = toSignal(toObservable(computed(() => ({ employeeId: this.employeeId(), id: this.id() }))).pipe(switchMap(({ employeeId, id }) => id ? toLoadState(this.service.listEmployeeAssignments(employeeId), data => !data.active.length && !data.ended.length).pipe(tap(state => { if (state.status === 'ready') { const item = [...state.data.active, ...state.data.ended].find(a => a.id === id); if (item) this.fill(item); } })) : of<LoadState<EmployeeAssignmentsDto>>({ status: 'empty' }))), { initialValue: { status: 'loading' } as LoadState<EmployeeAssignmentsDto> });
  protected readonly clientsState = toSignal(toObservable(signal(0)).pipe(switchMap(() => toLoadState(this.service.listClients({ page: 0, size: 100 })))), { initialValue: { status: 'loading' } as LoadState<Page<ClientDto>> });
  protected readonly countriesState = toSignal(toObservable(this.selectedClient).pipe(switchMap(id => id ? toLoadState(this.service.listClientCountries(id, { page: 0, size: 100 })) : of<LoadState<Page<ClientCountryDto>>>({ status: 'empty' }))), { initialValue: { status: 'empty' } as LoadState<Page<ClientCountryDto>> });
  protected readonly projectsState = toSignal(toObservable(computed(() => ({ clientId: this.selectedClient(), countryId: this.selectedCountry() }))).pipe(switchMap(({ clientId, countryId }) => clientId && countryId ? toLoadState(this.service.listProjects({ clientId, clientCountryId: countryId, page: 0, size: 100 })) : of<LoadState<Page<ProjectDto>>>({ status: 'empty' }))), { initialValue: { status: 'empty' } as LoadState<Page<ProjectDto>> });
  protected readonly contactsState = toSignal(toObservable(this.selectedProject).pipe(switchMap(id => id ? toLoadState(this.service.listProjectContacts(id, { page: 0, size: 100 })) : of<LoadState<Page<ProjectContactDto>>>({ status: 'empty' }))), { initialValue: { status: 'empty' } as LoadState<Page<ProjectContactDto>> });
  private fill(item: AssignmentDto): void {
    this.form.setValue({ clientId: item.clientId, clientCountryId: item.clientCountryId, projectId: item.projectId, contactId: item.contactId ?? '', role: item.role, startDate: item.startDate.slice(0, 10), endDate: item.endDate?.slice(0, 10) ?? '' });
    this.selectedClient.set(item.clientId); this.selectedCountry.set(item.clientCountryId); this.selectedProject.set(item.projectId);
  }
  protected changeClient(): void { this.selectedClient.set(this.form.controls.clientId.value); this.form.patchValue({ clientCountryId: '', projectId: '', contactId: '' }); this.selectedCountry.set(''); this.selectedProject.set(''); }
  protected changeCountry(): void { this.selectedCountry.set(this.form.controls.clientCountryId.value); this.form.patchValue({ projectId: '', contactId: '' }); this.selectedProject.set(''); }
  protected changeProject(): void { this.selectedProject.set(this.form.controls.projectId.value); this.form.controls.contactId.setValue(''); }
  protected errorFor(field: keyof typeof this.form.controls): string {
    const server = this.serverErrors()[field]?.[0]; if (server) return server;
    const control = this.form.controls[field]; return control.invalid && control.touched ? 'Este campo es obligatorio.' : '';
  }
  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); this.submitError.set('Revisá los datos indicados'); return; }
    const raw = this.form.getRawValue();
    if (raw.endDate && raw.endDate < raw.startDate) { this.submitError.set('Revisá los datos indicados'); this.serverErrors.set({ endDate: ['La fecha de finalización no puede preceder al inicio.'] }); return; }
    const request = { ...raw, role: raw.role.trim(), contactId: raw.contactId || null, endDate: raw.endDate || null };
    if (!request.role) { this.submitError.set('Revisá los datos indicados'); return; }
    this.saving.set(true); this.submitError.set(null); this.serverErrors.set({});
    const employeeId = this.employeeId(); const id = this.id();
    (id ? this.service.updateEmployeeAssignment(employeeId, id, request) : this.service.createEmployeeAssignment(employeeId, request)).subscribe({
      next: () => void this.router.navigate(['/project-assignments/assignments', employeeId], { state: { saved: true } }),
      error: (error: unknown) => { this.saving.set(false); this.submitError.set(error instanceof ApiProblemError && [409, 422].includes(error.status) ? 'Revisá los datos indicados' : error instanceof ApiProblemError && error.status === 404 ? 'No se encontró el registro solicitado' : 'No se pudieron guardar los cambios. Intentá nuevamente'); if (error instanceof ApiProblemError) this.serverErrors.set(error.fieldErrors); this.form.markAllAsTouched(); },
    });
  }
}
