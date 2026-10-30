import { ColaboradorResumen, ColaboradorFicha, EstadoColaborador, MovResumen } from '../models/colaboradores.models';
import { Page } from '../../../shared/models/page';

export const colaboradorResumenMock: ColaboradorResumen[] = [
  {
    id: 1,
    legajo: 'TFB-0001',
    nombreCompleto: 'Lucía Fernández',
    categoria: 'Permanente',
    cliente: 'Banco del Plata',
    proyecto: 'Banca digital\nPortal clientes',
    estado: 'ACTIVO',
  },
  {
    id: 2,
    legajo: 'TFB-0002',
    nombreCompleto: 'Martín Herrera',
    categoria: 'Permanente',
    cliente: 'Grupo Andino',
    proyecto: 'Plataforma logística',
    estado: 'ACTIVO',
  },
  {
    id: 3,
    legajo: 'TFB-0003',
    nombreCompleto: 'Sofía Álvarez',
    categoria: 'Pasante',
    cliente: 'Nexo Salud',
    proyecto: 'Portal pacientes',
    estado: 'ACTIVO',
  },
  {
    id: 4,
    legajo: 'TFB-0004',
    nombreCompleto: 'Diego Ríos',
    categoria: 'Permanente',
    cliente: 'Banco del Plata',
    proyecto: 'Banca digital',
    estado: 'ACTIVO',
  },
  {
    id: 5,
    legajo: 'TFB-0005',
    nombreCompleto: 'Valentina Costa',
    categoria: 'Permanente',
    cliente: 'Grupo Andino',
    proyecto: 'Integraciones API',
    estado: 'ACTIVO',
  },
  {
    id: 6,
    legajo: 'TFB-0006',
    nombreCompleto: 'Tomás Medina',
    categoria: 'Pasante',
    cliente: 'Nexo Salud',
    proyecto: 'Portal pacientes',
    estado: 'ACTIVO',
  },
  {
    id: 7,
    legajo: 'TFB-0007',
    nombreCompleto: 'Camila Suárez',
    categoria: 'Permanente',
    cliente: '—',
    proyecto: '—',
    estado: 'EGRESADO',
  },
  {
    id: 8,
    legajo: 'TFB-0008',
    nombreCompleto: 'Nicolás Vega',
    categoria: 'Pasante',
    cliente: '—',
    proyecto: '—',
    estado: 'EGRESADO',
  },
];

export const colaboradoresPageMock: Page<ColaboradorResumen> = {
  items: colaboradorResumenMock,
  page: 1,
  size: 20,
  total: 8
};

export const colaboradorFichaMock: ColaboradorFicha = {
  id: 1,
  legajo: 'TFB-0001',
  nombre: 'Lucía',
  apellido: 'Fernández',
  documentoTipo: 'DNI',
  documentoNumero: '32456789',
  paisResidencia: 'Argentina',
  fechaNacimiento: '1987-03-21',
  correoPersonal: 'lucia.fernandez@gmail.com',
  fechaIngreso: '2021-03-12',
  categoria: 'Permanente',
  dedicacion: 'Full time',
  modalidadTrabajo: 'Remota',
  rolLaboral: 'Desarrolladora backend sénior',
  emailCorporativo: 'lucia.fernandez@techforb.com',
  estado: 'ACTIVO',
  asignaciones: [
    {
      cliente: 'Banco Galicia',
      proyecto: 'Plataforma de pagos',
      rol: 'Desarrolladora backend',
      inicio: '2023-06-01',
      fin: null
    }
  ],
  beneficios: [ 'Vacaciones', 'Días off' ],
  documentos: [ 'DNI', 'Cuil' ],
  evaluaciones: [ '2023 S1: Verde', '2023 S2: Verde' ],
  bitacora: [ 'Alta de colaborador' ],
  remuneraciones: [ 'Febrero 2026: $900.000', 'Enero 2026: $850.000' ],
  bonos: [ 'Bono desempeño Jun 2026: $40.000', 'Cumpleaños 2025: $50 USD' ]
};
