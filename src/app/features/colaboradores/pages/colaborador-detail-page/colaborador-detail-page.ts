import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ColaboradoresService } from '../../data-access/colaboradores.service';
import { ColaboradorFicha } from '../../models/colaboradores.models';

@Component({
  selector: 'app-colaborador-detail-page',
  standalone: true,
  templateUrl: './colaborador-detail-page.html',
  styleUrl: './colaborador-detail-page.scss',
  imports: [CommonModule]
})
export class ColaboradorDetailPage {
  private readonly servicio = new ColaboradoresService();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public readonly cargando = signal<boolean>(true);
  public readonly error = signal<string | null>(null);
  public readonly ficha = signal<ColaboradorFicha | null>(null);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.cargando.set(true);
      this.servicio.getColaborador(id).subscribe({
        next: (ficha) => {
          this.ficha.set(ficha);
          this.cargando.set(false);
        },
        error: (err) => {
          this.error.set(typeof err === 'string' ? err : 'No se pudo cargar la ficha.');
          this.cargando.set(false);
        }
      });
    } else {
      this.error.set('Colaborador inexistente.');
      this.cargando.set(false);
    }
  }

  volverAlListado(): void {
    this.router.navigate(['/colaboradores']);
  }
  editar(): void {
    if (this.ficha()) {
      this.router.navigate(['/colaboradores', this.ficha()!.id, 'editar']);
    }
  }
}
