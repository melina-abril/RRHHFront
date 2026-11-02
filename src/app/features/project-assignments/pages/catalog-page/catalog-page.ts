import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { combineLatest, switchMap } from 'rxjs';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { PageHeader } from '../../../../shared/components/page-header';
import { StatusBadge } from '../../../../shared/components/status-badge';
import { LoadState } from '../../../../shared/models/load-state';
import { Page } from '../../../../shared/models/page';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { ProjectAssignmentsService } from '../../data-access/project-assignments.service';
import { ClientCountryDto, ClientDto, ProjectContactDto, ProjectDto } from '../../models/project-assignments.models';

@Component({ selector: 'app-catalog-page', imports: [RouterLink, ReactiveFormsModule, PageHeader, LoadingState, ErrorAlert, EmptyState, StatusBadge], templateUrl: './catalog-page.html', styleUrl: './catalog-page.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class CatalogPage {
  private readonly service = inject(ProjectAssignmentsService);
  private readonly builder = inject(NonNullableFormBuilder);
  protected readonly search = signal('');
  protected readonly selectedClientId = signal<string | null>(null);
  protected readonly selectedProjectId = signal<string | null>(null);
  protected readonly reloadCount = signal(0);
  protected readonly action = signal<'client' | 'country' | 'project' | 'contact' | null>(null);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly success = signal('');
  protected readonly fieldErrors = signal<Record<string, string[]>>({});
  protected readonly clientForm = this.builder.group({ name: ['', Validators.required], active: [true] });
  protected readonly countryForm = this.builder.group({ countryCode: ['', Validators.required], countryName: ['', Validators.required] });
  protected readonly projectForm = this.builder.group({ name: ['', Validators.required], active: [true], clientCountryIds: this.builder.control<string[]>([], Validators.required) });
  protected readonly contactForm = this.builder.group({ name: ['', Validators.required], email: ['', [Validators.required, Validators.email]], active: [true] });
  private readonly request = computed(() => ({ clientId: this.selectedClientId(), projectId: this.selectedProjectId(), reload: this.reloadCount() }));
  protected readonly clientsState = toSignal(toObservable(this.reloadCount).pipe(switchMap(() => toLoadState(this.service.listClients({ page: 0, size: 100 })))), { initialValue: { status: 'loading' } as LoadState<Page<ClientDto>> });
  protected readonly filteredClients = computed(() => this.clientsState().status === 'ready' ? (this.clientsState() as { status: 'ready'; data: Page<ClientDto> }).data.items.filter(c => c.name.toLowerCase().includes(this.search().toLowerCase())) : []);
  protected readonly selectedClient = computed(() => this.filteredClients().find(c => c.id === this.selectedClientId()) ?? null);
  protected readonly countriesState = toSignal(toObservable(this.request).pipe(switchMap(({ clientId }) => clientId ? toLoadState(this.service.listClientCountries(clientId, { page: 0, size: 100 })) : toLoadState(this.service.listClients({ page: 0, size: 1 }).pipe(switchMap(() => this.service.listClientCountries('', { page: 0, size: 1 }))))), { initialValue: { status: 'loading' } as LoadState<Page<ClientCountryDto>> });
  protected readonly projectsState = toSignal(toObservable(this.request).pipe(switchMap(({ clientId }) => clientId ? toLoadState(this.service.listProjects({ clientId, page: 0, size: 100 })) : toLoadState(this.service.listProjects({ clientId: '', page: 0, size: 1 })))), { initialValue: { status: 'loading' } as LoadState<Page<ProjectDto>> });
  protected readonly contactsState = toSignal(toObservable(this.request).pipe(switchMap(({ projectId }) => projectId ? toLoadState(this.service.listProjectContacts(projectId, { page: 0, size: 100 })) : toLoadState(this.service.listProjects({ page: 0, size: 1 }).pipe(switchMap(() => this.service.listProjectContacts('', { page: 0, size: 1 }))))), { initialValue: { status: 'loading' } as LoadState<Page<ProjectContactDto>> });
  protected selectClient(id: string): void { this.selectedClientId.set(id); this.selectedProjectId.set(null); this.action.set(null); }
  protected selectProject(id: string): void { this.selectedProjectId.set(id); }
  protected reload(): void { this.reloadCount.update(n => n + 1); }
  protected show(action: 'client' | 'country' | 'project' | 'contact'): void { this.action.set(action); this.error.set(null); this.fieldErrors.set({}); }
  protected errorFor(field: string): string { return this.fieldErrors()[field]?.[0] ?? ''; }
  protected changeCountries(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLSelectElement) this.projectForm.controls.clientCountryIds.setValue(Array.from(target.selectedOptions, option => option.value));
  }
  protected submit(): void {
    const action = this.action();
    if (!action) return;
    const form = action === 'client' ? this.clientForm : action === 'country' ? this.countryForm : action === 'project' ? this.projectForm : this.contactForm;
    if (form.invalid) { form.markAllAsTouched(); this.error.set('Revisá los datos indicados'); return; }
    const clientId = this.selectedClientId(); const projectId = this.selectedProjectId();
    if ((action === 'country' || action === 'project') && !clientId || action === 'contact' && !projectId) { this.error.set('No hay opciones disponibles para esta selección'); return; }
    this.busy.set(true); this.error.set(null);
    const onSuccess = (): void => { this.busy.set(false); this.action.set(null); this.success.set('Cambios guardados correctamente'); this.reload(); };
    const onError = (error: unknown): void => { this.busy.set(false); this.error.set(error instanceof ApiProblemError && [409, 422].includes(error.status) ? 'Revisá los datos indicados' : 'No se pudieron guardar los cambios. Intentá nuevamente'); if (error instanceof ApiProblemError) this.fieldErrors.set(error.fieldErrors); };
    if (action === 'client') this.service.createClient(this.clientForm.getRawValue()).subscribe({ next: onSuccess, error: onError });
    if (action === 'country' && clientId) this.service.addClientCountry(clientId, this.countryForm.getRawValue()).subscribe({ next: onSuccess, error: onError });
    if (action === 'project' && clientId) this.service.createProject({ clientId, ...this.projectForm.getRawValue() }).subscribe({ next: onSuccess, error: onError });
    if (action === 'contact' && projectId) this.service.createProjectContact(projectId, this.contactForm.getRawValue()).subscribe({ next: onSuccess, error: onError });
  }
}
