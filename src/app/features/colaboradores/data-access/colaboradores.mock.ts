import type { Page } from '../../../shared/models/page';
import type { ColaboradorResumen, ColaboradorFicha, EstadoColaborador, MovResumen } from '../models/colaboradores.models';

const now = () => (new Date()).toISOString().slice(0, 10);

export const COLABORADORES_MOCK_PAGE: Page<ColaboradorResumen> = {
  items: [
    {
      id: 1,
      legajo: 'TFB-0001',
      nombreCompleto: 'Lucía Fernández',
      categoria: 'Permanente',
      cliente: 'Banco del Plata',
      proyecto: 'Banca digital, Portal clientes',
      estado: 'ACTIVO'
    },
    {
      id: 2,
      legajo: 'TFB-0002',
      nombreCompleto: 'Martín Herrera',
      categoria: 'Permanente',
      cliente: 'Grupo Andino',
      proyecto: 'Plataforma logística',
      estado: 'ACTIVO'
    },
    {
      id: 3,
      legajo: 'TFB-0003',
      nombreCompleto: 'Sofía Álvarez',
      categoria: 'Pasante',
      cliente: 'Nexo Salud',
      proyecto: 'Portal pacientes',
      estado: 'ACTIVO'
    },
    {
      id: 4,
      legajo: 'TFB-0004',
      nombreCompleto: 'Diego Ríos',
      categoria: 'Permanente',
      cliente: 'Banco del Plata',
      proyecto: 'Banca digital',
      estado: 'ACTIVO'
    },
    {
      id: 5,
      legajo: 'TFB-0005',
      nombreCompleto: 'Valentina Costa',
      categoria: 'Permanente',
      cliente: 'Grupo Andino',
      proyecto: 'Integraciones API',
      estado: 'ACTIVO'
    },
    {
      id: 6,
      legajo: 'TFB-0006',
      nombreCompleto: 'Tomás Medina',
      categoria: 'Pasante',
      cliente: 'Nexo Salud',
      proyecto: 'Portal pacientes',
      estado: 'ACTIVO'
    },
    {
      id: 7,
      legajo: 'TFB-0007',
      nombreCompleto: 'Camila Suárez',
      categoria: 'Permanente',
      cliente: '',
      proyecto: '',
      estado: 'EGRESADO'
    },
    {
      id: 8,
      legajo: 'TFB-0008',
      nombreCompleto: 'Nicolás Vega',
      categoria: 'Pasante',
      cliente: '',
      proyecto: '',
      estado: 'EGRESADO'
    }
  ],
  page: 0,
  size: 20,
  total: 8
};

export const COLABORADORES_MOCK_FICHAS: Record<number, ColaboradorFicha> = {
  1: {
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
    emailCorporativo: 'lfernandez@techforb.com',
    estado: 'ACTIVO',
    asignaciones: [
      {
        cliente: 'Banco del Plata',
        proyecto: 'Banca digital',
        rol: 'Desarrolladora frontend',
        inicio: '2021-03-12',
        fin: null
      },
      {
        cliente: 'Banco del Plata',
        proyecto: 'Portal clientes',
        rol: 'Desarrolladora frontend',
        inicio: '2023-01-10',
        fin: null
      }
    ],
    beneficios: ['Vacaciones', 'Días Off'],
    documentos: ['Documento de Identidad', 'Recibo de sueldo'],
    evaluaciones: ['Marzo 2023: Verde'],
    bitacora: ['Ingreso: 2021-03-12'],
    remuneraciones: ['2025-12: $2.200.000'],
    bonos: ['Bono desempeño 2024']
  },
  2: {
    id: 2,
    legajo: 'TFB-0002',
    nombre: 'Martín',
    apellido: 'Herrera',
    documentoTipo: 'DNI',
    documentoNumero: '29547382',
    paisResidencia: 'Argentina',
    fechaNacimiento: '1985-07-09',
    correoPersonal: 'martin.herrera@gmail.com',
    fechaIngreso: '2020-07-08',
    categoria: 'Permanente',
    dedicacion: 'Full time',
    modalidadTrabajo: 'Remota',
    rolLaboral: 'Líder técnico',
    emailCorporativo: 'mherrera@techforb.com',
    estado: 'ACTIVO',
    asignaciones: [
      {
        cliente: 'Grupo Andino',
        proyecto: 'Plataforma logística',
        rol: 'Líder técnico',
        inicio: '2020-07-08',
        fin: null
      }
    ],
    beneficios: ['Vacaciones', 'Días Off', 'Licencia de mudanza'],
    documentos: [],
    evaluaciones: ['Marzo 2023: Amarillo'],
    bitacora: ['Ingreso: 2020-07-08'],
    remuneraciones: ['2025-12: $1.980.000'],
    bonos: []
  }
  // ...otros fichas ficticios (solo 1 y 2 completos para el mock principal)
};
