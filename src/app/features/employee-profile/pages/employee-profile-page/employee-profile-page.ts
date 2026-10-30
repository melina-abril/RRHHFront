import { Component, computed, signal, effect } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeProfileService } from '../../data-access/employee-profile.service';
import { EmployeeProfile } from '../../models/employee-profile.models';
import { LoadState } from 'src/app/shared/models/load-state';
import { EmptyState } from 'src/app/shared/components/empty-state';
import { ErrorAlert } from 'src/app/shared/components/error-alert';
import { LoadingState } from 'src/app/shared/components/loading-state';

@Component({
  selector: 'app-employee-profile-page',
  standalone: true,
  imports: [NgIf, RouterLink, AsyncPipe, DatePipe, EmptyState, ErrorAlert, LoadingState],
  templateUrl: './employee-profile-page.html',
  styleUrl: './employee-profile-page.scss'
})
export class EmployeeProfilePage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profileService = inject(EmployeeProfileService);

  // Estado de carga de la ficha
  readonly state = signal<LoadState<EmployeeProfile>>({ status: 'loading' });
  // id
  readonly legajo = this.route.snapshot.paramMap.get('legajo') ?? '';

  constructor() {
    this.fetchProfile();
  }

  fetchProfile() {
    if (!this.legajo) {
      this.state.set({ status: 'error', message: 'No se ha indicado el legajo del colaborador.' });
      return;
    }
    this.state.set({ status: 'loading' });
    this.profileService.getEmployeeProfile(this.legajo).subscribe({
      next: (profile) => {
        if (!profile) {
          this.state.set({ status: 'empty' });
        } else {
          this.state.set({ status: 'ready', data: profile });
        }
      },
      error: (err) => {
        this.state.set({ status: 'error', message: err?.message || 'Ocurrió un error al cargar la ficha.' });
      }
    });
  }

  onBack(): void {
    // Volver al listado de empleados o a la ruta padre
    this.router.navigate(['/colaboradores']);
  }

  onEdit(): void {
    // Navega a la edición (protegido: solo mock aquí)
    this.router.navigate(['/colaboradores', this.legajo, 'editar']);
  }

  getInitials(nombre?: string, apellido?: string): string {
    if (!nombre && !apellido) return '';
    if (!nombre) return (apellido ?? '').slice(0, 2).toUpperCase();
    if (!apellido) return (nombre ?? '').slice(0, 2).toUpperCase();
    return `${nombre[0]}${apellido[0]}`.toUpperCase();
  }
}
