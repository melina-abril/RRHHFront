import { EmployeeListItemSummary, EmployeeListPageResponse } from '../models/employee-list.models';

export const EMPLOYEE_LIST_MOCK: EmployeeListPageResponse = {
  items: [
    {
      legajo: 'TFB-0001',
      nombre: 'Lucía',
      apellido: 'Fernández',
      fechaNacimiento: '1994-08-12',
      categoria: 'Permanente',
      estado: 'Activo',
      sector: 'Tecnología',
      puesto: 'Desarrolladora frontend',
      descripcionRol: 'Frontend React',
      cliente: 'Banco del Plata',
      proyecto: 'Banca digital, Portal clientes'
    },
    {
      legajo: 'TFB-0002',
      nombre: 'Martín',
      apellido: 'Herrera',
      fechaNacimiento: '1989-02-28',
      categoria: 'Permanente',
      estado: 'Activo',
      sector: 'Tecnología',
      puesto: 'Líder técnico',
      descripcionRol: 'Referente mobile',
      cliente: 'Grupo Andino',
      proyecto: 'Plataforma logística'
    },
    {
      legajo: 'TFB-0003',
      nombre: 'Sofía',
      apellido: 'Álvarez',
      fechaNacimiento: '2001-06-04',
      categoria: 'Pasante',
      estado: 'Activo',
      sector: 'Funcional',
      puesto: 'Analista funcional',
      descripcionRol: '-',
      cliente: 'Nexo Salud',
      proyecto: 'Portal pacientes'
    },
    {
      legajo: 'TFB-0004',
      nombre: 'Diego',
      apellido: 'Ríos',
      fechaNacimiento: '1998-03-21',
      categoria: 'Permanente',
      estado: 'Activo',
      sector: 'Datos',
      puesto: 'Analista de datos',
      descripcionRol: '-',
      cliente: 'Banco del Plata',
      proyecto: 'Banca digital'
    },
    {
      legajo: 'TFB-0005',
      nombre: 'Valentina',
      apellido: 'Costa',
      fechaNacimiento: '1997-01-16',
      categoria: 'Permanente',
      estado: 'Activo',
      sector: 'Tecnología',
      puesto: 'Desarrolladora backend',
      descripcionRol: 'Spring / Java',
      cliente: 'Grupo Andino',
      proyecto: 'Integraciones API'
    },
    {
      legajo: 'TFB-0006',
      nombre: 'Tomás',
      apellido: 'Medina',
      fechaNacimiento: '2003-03-07',
      categoria: 'Pasante',
      estado: 'Activo',
      sector: 'QA',
      puesto: 'Pruebas de software',
      descripcionRol: '-',
      cliente: 'Nexo Salud',
      proyecto: 'Portal pacientes'
    },
    {
      legajo: 'TFB-0007',
      nombre: 'Camila',
      apellido: 'Suárez',
      fechaNacimiento: '1992-10-11',
      categoria: 'Permanente',
      estado: 'Inactivo',
      sector: 'Diseño',
      puesto: 'Diseñadora UX',
      descripcionRol: '-',
      cliente: '',
      proyecto: ''
    },
    {
      legajo: 'TFB-0008',
      nombre: 'Nicolás',
      apellido: 'Vega',
      fechaNacimiento: '2002-12-22',
      categoria: 'Pasante',
      estado: 'Inactivo',
      sector: 'Soporte',
      puesto: 'Soporte técnico',
      descripcionRol: '-',
      cliente: '',
      proyecto: ''
    }
  ],
  page: 0,
  size: 20,
  total: 8
};
