import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ColaboradoresService } from '../../data-access/colaboradores.service';
import { CrearColaboradorRequest, EditarColaboradorRequest, ColaboradorFicha } from '../../models/colaboradores.models';

@Component({
  selector: 'app-colaborador-form-page',
  standalone: true,
  templateUrl: './colaborador-form-page.html',
  styleUrl: './colaborador-form-page.scss',
  imports: [CommonModule, ReactiveFormsModule]
})
export class ColaboradorFormPage {
  private readonly servicio = new ColaboradoresService();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  public readonly cargando = signal<boolean>(false);
  public readonly error = signal<string | null>(null);
  public readonly esEdicion = signal<boolean>(false);

  public formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(60)]],
    apellido: ['', [Validators.required, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    categoria: ['', [Validators.required]],
    cliente: ['', [Validators.maxLength(40)]],
    proyecto: ['', [Validators.maxLength(40)]]
  });

  constructor() {
    // Determinar si es edición según la ruta
    const id = this.route.snapshot.paramMap.get('id');
    this.esEdicion.set(!!id && id !== 'nuevo');
    if (this.esEdicion()) {
      this.cargarColaborador(+id!);
    }
  }

  cargarColaborador(id: number): void {
    this.cargando.set(true);
    this.servicio.getColaborador(id).subscribe({
      next: (data: ColaboradorFicha) => {
        this.formulario.patchValue({
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email,
          categoria: data.categoria,
          cliente: data.cliente,
          proyecto: data.proyecto
        });
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el colaborador.');
        this.cargando.set(false);
        // Podrías navegar o mostrar mensaje persistente
      }
    });
  }

  guardar(): void {
    this.cargando.set(true);
    this.error.set(null);
    if (this.formulario.invalid) {
      this.cargando.set(false);
      this.error.set('Por favor corrige los errores antes de guardar.');
      return;
    }

    const req: CrearColaboradorRequest | EditarColaboradorRequest = this.formulario.value as any;
    if (this.esEdicion()) {
      // Edición
      const id = Number(this.route.snapshot.paramMap.get('id'));
      this.servicio.editarColaborador(id, req as EditarColaboradorRequest).subscribe({
        next: () => {
          this.cargando.set(false);
          this.router.navigate(['/colaboradores', id]);
        },
        error: (err) => {
          this.error.set(typeof err === 'string' ? err : 'Hubo un error al guardar los cambios.');
          this.cargando.set(false);
        }
      });
    } else {
      // Alta
      this.servicio.altaColaborador(req as CrearColaboradorRequest).subscribe({
        next: (created) => {
          this.cargando.set(false);
          this.router.navigate(['/colaboradores', created.id]);
        },
        error: (err) => {
          this.error.set(typeof err === 'string' ? err : 'Error al crear colaborador.');
          this.cargando.set(false);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/colaboradores']);
  }
}
