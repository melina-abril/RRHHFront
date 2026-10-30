import { Component, signal, computed } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EmployeeOnboardingService } from '../../data-access/employee-onboarding.service';
import { EmployeeOnboardingRequest } from '../../models/employee-onboarding.models';
import { Router } from '@angular/router';
import { PageHeader } from 'src/app/shared/components/page-header';
import { ErrorAlert } from 'src/app/shared/components/error-alert';
import { LoadingState } from 'src/app/shared/components/loading-state';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-employee-onboarding-page',
  standalone: true,
  templateUrl: './employee-onboarding-page.html',
  styleUrl: './employee-onboarding-page.scss',
  imports: [ReactiveFormsModule, PageHeader, ErrorAlert, LoadingState]
})
export class EmployeeOnboardingPage {
  private fb: NonNullableFormBuilder = new FormBuilder().nonNullable;
  // Formulario reactivo tipado y agrupado por secciones
  form = this.fb.group({
    // Datos personales
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    paisResidencia: ['', [Validators.required]],
    correoPersonal: ['', [Validators.required, Validators.email]],
    // Opcionales personales
    documento: [''],
    nacionalidad: [''],
    telefono: [''],
    domicilio: [''],
    contactoEmergencia: [''],
    telefonoEmergencia: [''],
    // Datos laborales
    fechaIngreso: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    contratacion: [''],
    dedicacion: ['', [Validators.required]],
    modalidadTrabajo: ['', [Validators.required]],
    rolLaboral: ['', [Validators.required]],
    // Corporativos
    correoCorporativo: [''],
    equipo: [''],
    datosCorporativos: [''],
    // Asignación inicial opcional
    cliente: [''],
    paisProyecto: [{ value: '', disabled: true }],
    proyecto: [{ value: '', disabled: true }],
    referente: [{ value: '', disabled: true }],
    rolProyecto: [''],
    fechaInicioProyecto: ['']
  });

  // Estado de guardado (LoadState<null>)
  saveState = signal<{ status: 'idle' | 'loading' | 'error'; message?: string }>({ status: 'idle' });

  // Mostrar/ocultar indicaciones (siempre visible, incluso ante error)
  get showIndications() { return true; }

  constructor(
    private svc: EmployeeOnboardingService,
    private router: Router
  ) {}

  onCancelar() {
    this.router.navigate(['/employee-list']);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saveState.set({ status: 'loading' });
    const request: EmployeeOnboardingRequest = {
      nombre: this.form.value.nombre!,
      apellido: this.form.value.apellido!,
      fechaNacimiento: this.form.value.fechaNacimiento!,
      paisResidencia: this.form.value.paisResidencia!,
      correoPersonal: this.form.value.correoPersonal!,
      fechaIngreso: this.form.value.fechaIngreso!,
      categoria: this.form.value.categoria!,
      dedicacion: this.form.value.dedicacion!,
      modalidadTrabajo: this.form.value.modalidadTrabajo!,
      rolLaboral: this.form.value.rolLaboral!,
      cliente: this.form.value.cliente || null,
      proyecto: this.form.value.proyecto || null,
      referente: this.form.value.referente || null,
      datosCorporativos: this.form.value.datosCorporativos || null
    };
    this.svc.createEmployee(request).subscribe({
      next: () => {
        this.saveState.set({ status: 'idle' });
        this.router.navigate(['/employee-list']);
      },
      error: err => {
        this.saveState.set({ status: 'error', message: err?.message || 'Ocurrió un error al guardar. Por favor intentá nuevamente.' });
      }
    });
  }

  // Accesibilidad: devuelve nombre del campo si es inválido y tocado
  invalid(ctrl: string): boolean {
    const c = this.form.get(ctrl);
    return !!(c && c.invalid && (c.touched || c.dirty));
  }
}
