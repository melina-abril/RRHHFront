import { Page } from 'src/app/shared/models/page';

export interface EmployeeListFilterRequest {
  search?: string;
  categoria?: string;
  cliente?: string;
  proyecto?: string;
  estado?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface EmployeeListItemSummary {
  legajo: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // ISO date (YYYY-MM-DD)
  categoria: string;
  estado: string;
  sector: string;
  puesto: string;
  descripcionRol: string;
  cliente: string;
  proyecto: string;
}

export type EmployeeListPageResponse = Page<EmployeeListItemSummary>;
