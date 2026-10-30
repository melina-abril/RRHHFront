import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EmployeeListItemSummary } from '../models/employee-list.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'employee-table',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="employee-table-wrapper">
      <table class="employee-table">
        <colgroup>
          <col style="width:90px;" />
          <col style="width:160px;" />
          <col style="width:110px;" />
          <col style="width:135px;" />
          <col style="width:150px;" />
          <col style="width:128px;" />
          <col style="width:105px;" />
          <col style="width:92px;" />
          <col style="width:120px;" />
        </colgroup>
        <thead>
          <tr>
            <th>Legajo</th>
            <th>Nombre y Apellido</th>
            <th>Categoría</th>
            <th>Cliente</th>
            <th>Proyecto</th>
            <th>Rol</th>
            <th>Fecha de nacimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          @for (employee of employees; track employee.legajo) {
            <tr>
              <td>{{employee.legajo}}</td>
              <td><span class="emp-table__name">{{employee.nombre}} {{employee.apellido}}</span></td>
              <td>{{employee.categoria}}</td>
              <td>{{employee.cliente || '—'}}</td>
              <td>{{employee.proyecto || '—'}}</td>
              <td>{{employee.descripcionRol || employee.puesto || '—'}}</td>
              <td>{{ employee.fechaNacimiento | date : 'dd/MM/yyyy' }}</td>
              <td>
                <span class="emp-table__badge" [ngClass]="{ 'status-green': employee.estado === 'Activo', 'status-red': employee.estado === 'Inactivo' }">
                  {{ employee.estado }}
                </span>
              </td>
              <td>
                <button type="button" class="emp-table__ver" (click)="viewProfile.emit(employee.legajo)">
                  Ver ficha
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styleUrl: './employee-table.scss'
})
export class EmployeeTable {
  @Input({ required: true }) employees!: EmployeeListItemSummary[];
  @Output() viewProfile = new EventEmitter<string>();
}
