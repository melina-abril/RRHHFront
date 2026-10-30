import { DatePipe } from '@angular/common';
import { Component, signal, effect, computed, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeEditionService } from '../../data-access/employee-edition.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UpdateEmployeeRequest, UpdateEmployeeResponse } from '../../models/employee-edition.models';
import { EmptyState } from 'src/app/shared/components/empty-state';
import { LoadingState } from 'src/app/shared/components/loading-state';
import { ErrorAlert } from 'src/app/shared/components/error-alert';

@Component({
  selector: 'app-employee-edit-page',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, EmptyState, LoadingState, ErrorAlert],
  templateUrl: './employee-edit-page.html',
  styleUrl: './employee-edit-page.scss'
})
export class EmployeeEditPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private editionService = inject(EmployeeEditionService);
  private fb = inject(FormBuilder);

  // Señales de estado
  loading = signal(true);
  employee = signal<any | null>(null); // Cargar colaborador real (por now dummy, o integración con perfil)
  saveState = signal<{ status: 'idle' | 'saving' | 'ok' | 'error'; message?: string }>({ status: 'idle' });

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    paisResidencia: ['', [Validators.required]],
    correoPersonal: ['', [Validators.required, Validators.email]],
    dedicacion: ['', [Validators.required]],
    modalidadTrabajo: ['', [Validators.required]],
    rolLaboral: ['', [Validators.required]],
    categoria: ['']
  });

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('id');
      this.cargarColaborador(id);
    });
  }

  cargarColaborador(id: string | null) {
    if (!id) {
      this.employee.set(null);
      this.loading.set(false);
      return;
    }
    // Dummy: datos mock — en real pedir ficha por id
    setTimeout(() => {
      // Ejemplo dummy de chequeo
      if (id === '99999') { this.employee.set(null); this.loading.set(false); return; }
      this.employee.set({
        legajo: 'TFB-' + id.padStart(4, '0'),
        nombre: 'Valentina',
        apellido: 'Romero',
        fechaNacimiento: '1992-08-12',
        paisResidencia: 'Argentina',
        correoPersonal: 'valen.romero@gmail.com',
        dedicacion: 'full time',
        modalidadTrabajo: 'híbrida',
        rolLaboral: 'Desarrolladora Senior',
        categoria: 'Permanente',
        estado: 'Activa',
        ultimaActualizacion: '2025-02-18T10:42:00Z'
      });
      this.form.patchValue({
        nombre: 'Valentina',
        apellido: 'Romero',
        fechaNacimiento: '1992-08-12',
        paisResidencia: 'Argentina',
        correoPersonal: 'valen.romero@gmail.com',
        dedicacion: 'full time',
        modalidadTrabajo: 'híbrida',
        rolLaboral: 'Desarrolladora Senior',
        categoria: 'Permanente'
      });
      this.loading.set(false);
    }, 400);
  }

  initials(emp: any): string {
    return emp?.nombre && emp?.apellido ? (emp.nombre[0] + emp.apellido[0]).toUpperCase() : '';
  }

  onBack() {
    if (this.employee()) {
      this.router.navigate(['/colaboradores', this.employee().legajo.replace('TFB-', '')]);
    } else {
      this.router.navigate(['/colaboradores']);
    }
  }

  onCancel() {
    this.onBack();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saveState.set({ status: 'saving' });
    const id = this.route.snapshot.paramMap.get('id')!;
    const req: UpdateEmployeeRequest = {
      ...this.form.value
    };
    this.editionService.updateEmployee(id, req).subscribe({
      next: (resp: UpdateEmployeeResponse) => {
        this.saveState.set({ status: 'ok' });
        // Vuelve a la ficha editada
        this.router.navigate(['/colaboradores', id]);
      },
      error: (err) => {
        this.saveState.set({ status: 'error', message: err?.message || 'Error al guardar los cambios.' });
      }
    });
  }
}
