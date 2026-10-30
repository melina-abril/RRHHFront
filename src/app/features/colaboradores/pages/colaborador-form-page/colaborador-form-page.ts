import { Component, signal } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ColaboradoresService } from '../../data-access/colaboradores.service';
import { CrearColaboradorRequest } from '../../models/colaboradores.models';

@Component({
  selector: 'app-colaborador-form-page',
  standalone: true,
  templateUrl: './colaborador-form-page.html',
  styleUrl: './colaborador-form-page.scss',
  imports: [ReactiveFormsModule]
})
export class ColaboradorFormPage {
  private fb = new FormBuilder();
  private service = new ColaboradoresService();

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    fechaNacimiento: ['', [Validators.required]],
    paisResidencia: ['', [Validators.required]],
    documentoTipo: [''],
    documentoNumero: [''],
    correoPersonal: ['', [Validators.required, Validators.email]],
    fechaIngreso: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    dedicacion: ['', [Validators.required]],
    modalidadTrabajo: ['', [Validators.required]],
    rolLaboral: ['', [Validators.required]],
    emailCorporativo: [''],
    cliente: [''],
    proyecto: [''],
    rolProyecto: [''],
    inicioProyecto: ['']
  });

  errorMsg = signal<string>('');
  loading = signal<boolean>(false);

  guardarColaborador() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');
    const req: CrearColaboradorRequest = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      documentoTipo: this.form.value.documentoTipo,
      documentoNumero: this.form.value.documentoNumero,
      paisResidencia: this.form.value.paisResidencia,
      fechaNacimiento: this.form.value.fechaNacimiento,
      correoPersonal: this.form.value.correoPersonal,
      fechaIngreso: this.form.value.fechaIngreso,
      categoria: this.form.value.categoria,
      dedicacion: this.form.value.dedicacion,
      modalidadTrabajo: this.form.value.modalidadTrabajo,
      rolLaboral: this.form.value.rolLaboral,
      emailCorporativo: this.form.value.emailCorporativo
    };
    this.service.altaColaborador(req).then(() => {
      this.loading.set(false);
      // @todo: navegar a ficha creada
    }).catch((err: any) => {
      this.loading.set(false);
      this.errorMsg.set(err?.error?.message || 'No se pudo guardar el colaborador');
    });
  }

  cancelar() {
    // @todo: navegar al listado sin guardar
  }
}
