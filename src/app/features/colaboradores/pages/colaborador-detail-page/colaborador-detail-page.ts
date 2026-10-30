import { LowerCasePipe, DatePipe } from '@angular/common';
import { Component, signal, effect } from '@angular/core';
import { ColaboradoresService } from '../../data-access/colaboradores.service';
import type { ColaboradorFicha } from '../../models/colaboradores.models';
import { LoadState } from '../../../../shared/models/load-state';

@Component({
  selector: 'app-colaborador-detail-page',
  standalone: true,
  templateUrl: './colaborador-detail-page.html',
  styleUrl: './colaborador-detail-page.scss',
  imports: [LowerCasePipe, DatePipe, ] // agregar pipes, routerLink, etc. en base
})
export class ColaboradorDetailPage {
  private service = new ColaboradoresService();
  fichaState = signal<LoadState<ColaboradorFicha>>({ status: 'loading' });
  ficha = signal<ColaboradorFicha | undefined>(undefined);
  initials = '';

  ngOnInit() {
    this.cargarFicha();
  }

  cargarFicha() {
    // @todo: obtener id por ActivatedRoute y buscar
    const mockId = 1;
    this.service.getColaborador(mockId).then(f => {
      this.ficha.set(f);
      this.initials = this.getInitials(f.nombre, f.apellido);
    }).catch(() => {
      this.ficha.set(undefined);
    });
  }

  getInitials(n: string, a: string) {
    return ((n?.[0] || '') + (a?.[0] || '')).toUpperCase();
  }

  volverAlListado() {
    // @todo: router.navigate(['/colaboradores']);
  }
  editarColaborador() {
    // @todo: router.navigate(['editar'], { relativeTo: ... });
  }
}
