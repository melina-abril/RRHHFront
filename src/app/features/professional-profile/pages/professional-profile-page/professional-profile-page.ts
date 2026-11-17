import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { ApiProblemError, errorMessage } from '../../../../core/http/api-error';
import { EmptyState } from '../../../../shared/components/empty-state';
import { ErrorAlert } from '../../../../shared/components/error-alert';
import { LoadingState } from '../../../../shared/components/loading-state';
import { LoadState } from '../../../../shared/models/load-state';
import { toLoadState } from '../../../../shared/utils/to-load-state';
import { ProfessionalProfileService } from '../../data-access/professional-profile.service';
import { DocumentContentType, ProfessionalDocumentResponse, ProfessionalProfileRequest, ProfessionalProfileResponse } from '../../models/professional-profile.models';

type ProfileField = 'skills' | 'technologies' | 'experienceYears' | 'experienceDescription' | 'certifications';
type DocumentField = 'title' | 'category' | 'description';

@Component({
  selector: 'app-professional-profile-page',
  imports: [DatePipe, RouterLink, ReactiveFormsModule, EmptyState, ErrorAlert, LoadingState],
  templateUrl: './professional-profile-page.html',
  styleUrl: './professional-profile-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfessionalProfilePage {
  readonly id = input<string>();

  private readonly service = inject(ProfessionalProfileService);
  private readonly builder = inject(NonNullableFormBuilder);
  protected readonly tab = signal<'profile' | 'documents'>('profile');
  protected readonly editing = signal(false);
  protected readonly addingDocument = signal(false);
  protected readonly saving = signal(false);
  protected readonly actionError = signal<string | null>(null);
  protected readonly fileError = signal<string | null>(null);
  protected readonly selectedFile = signal<File | null>(null);
  protected readonly fieldErrors = signal<Record<string, string[]>>({});
  private readonly reloadCount = signal(0);
  private readonly request = computed(() => ({ id: this.id(), reload: this.reloadCount() }));
  protected readonly profileState = toSignal(
    toObservable(this.request).pipe(switchMap(({ id }) => id
      ? toLoadState(this.service.getProfessionalProfile(id))
      : of<LoadState<ProfessionalProfileResponse>>({ status: 'empty' }))),
    { initialValue: { status: 'loading' } as LoadState<ProfessionalProfileResponse> },
  );

  protected readonly profileForm = this.builder.group({
    skills: ['', Validators.maxLength(6500)],
    technologies: ['', Validators.maxLength(6500)],
    experienceYears: ['', Validators.pattern(/^(?:[0-9]+(?:\.[0-9]+)?)?$/)],
    experienceDescription: ['', Validators.maxLength(2000)],
    certifications: ['', Validators.maxLength(6500)],
  });
  protected readonly documentForm = this.builder.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    category: ['', [Validators.required, Validators.maxLength(80)]],
    description: ['', Validators.maxLength(500)],
  });

  protected reload(): void {
    this.reloadCount.update((count) => count + 1);
  }

  protected edit(profile: ProfessionalProfileResponse): void {
    this.actionError.set(null);
    this.fieldErrors.set({});
    this.profileForm.setValue({
      skills: profile.skills.join(', '),
      technologies: profile.technologies.join(', '),
      experienceYears: profile.experienceYears === null ? '' : String(profile.experienceYears),
      experienceDescription: profile.experienceDescription,
      certifications: profile.certifications.join(', '),
    });
    this.editing.set(true);
  }

  protected errorFor(field: ProfileField | DocumentField): string {
    const server = this.fieldErrors()[field]?.[0];
    if (server) return server;
    const control = field in this.profileForm.controls
      ? this.profileForm.controls[field as ProfileField]
      : this.documentForm.controls[field as DocumentField];
    if (!control.touched || !control.errors) return '';
    if (control.hasError('required')) return 'Este campo es obligatorio.';
    if (control.hasError('pattern')) return 'Ingresa un número válido.';
    return 'Revisa la longitud de este campo.';
  }

  private items(value: string): string[] {
    return value.split(',').map((item) => item.trim()).filter((item) => item.length > 0);
  }

  protected saveProfile(): void {
    const id = this.id();
    if (!id || this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const value = this.profileForm.getRawValue();
    const years = value.experienceYears.trim() === '' ? null : Number(value.experienceYears);
    if (years !== null && (!Number.isFinite(years) || years < 0 || years > 80)) {
      this.profileForm.controls.experienceYears.setErrors({ range: true });
      this.profileForm.controls.experienceYears.markAsTouched();
      return;
    }
    const request: ProfessionalProfileRequest = {
      skills: this.items(value.skills),
      technologies: this.items(value.technologies),
      experienceYears: years,
      experienceDescription: value.experienceDescription.trim(),
      certifications: this.items(value.certifications),
    };
    if (request.skills.length > 50 || request.technologies.length > 50 || request.certifications.length > 50 ||
      [...request.skills, ...request.technologies, ...request.certifications].some((item) => item.length > 120)) {
      this.actionError.set('Cada lista admite hasta 50 elementos de 120 caracteres.');
      return;
    }
    this.saving.set(true);
    this.actionError.set(null);
    this.fieldErrors.set({});
    this.service.updateProfessionalProfile(id, request).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.reload();
      },
      error: (error: unknown) => this.handleError(error),
    });
  }

  protected selectFile(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const file = target.files?.item(0) ?? null;
    this.fileError.set(null);
    if (file && !['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
      this.fileError.set('Selecciona un PDF, PNG o JPEG.');
      this.selectedFile.set(null);
      return;
    }
    if (file && file.size > 400000) {
      this.fileError.set('Selecciona un archivo de hasta 400 KB.');
      this.selectedFile.set(null);
      return;
    }
    this.selectedFile.set(file);
  }

  protected async saveDocument(): Promise<void> {
    const id = this.id();
    if (!id || this.documentForm.invalid || this.fileError()) {
      this.documentForm.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.actionError.set(null);
    this.fieldErrors.set({});
    const { title, category, description } = this.documentForm.getRawValue();
    const request = { title: title.trim(), category: category.trim(), description: description.trim() };
    try {
      const file = this.selectedFile();
      if (file) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        let binary = '';
        for (const byte of bytes) binary += String.fromCharCode(byte);
        const contentType = file.type as DocumentContentType;
        Object.assign(request, { fileName: file.name, contentType, contentBase64: btoa(binary) });
      }
      this.service.addDocument(id, request).subscribe({
        next: () => {
          this.saving.set(false);
          this.addingDocument.set(false);
          this.selectedFile.set(null);
          this.documentForm.reset();
          this.reload();
        },
        error: (error: unknown) => this.handleError(error),
      });
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  protected openDocument(document: ProfessionalDocumentResponse, download: boolean): void {
    if (!document.contentBase64 || !document.contentType) return;
    try {
      const binary = atob(document.contentBase64);
      const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: document.contentType }));
      const link = window.document.createElement('a');
      link.href = url;
      if (download) link.download = document.fileName ?? document.title;
      else link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      this.actionError.set('No se pudo abrir el archivo.');
    }
  }

  private handleError(error: unknown): void {
    this.saving.set(false);
    this.actionError.set(errorMessage(error));
    if (error instanceof ApiProblemError) this.fieldErrors.set(error.fieldErrors);
  }
}
