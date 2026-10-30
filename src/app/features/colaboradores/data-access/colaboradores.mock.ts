import type { ColaboradorResumen, ColaboradorFicha, MovResumen } from '../models/colaboradores.models';
import type { Page } from '../../../shared/models/page';

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
      cliente: '—',
      proyecto: '—',
      estado: 'EGRESADO'
    },
    {
      id: 8,
      legajo: 'TFB-0008',
      nombreCompleto: 'Nicolás Vega',
      categoria: 'Pasante',
      cliente: '—',
      proyecto: '—',
      estado: 'EGRESADO'
    }
  ],
  page: 0,
  size: 20,
  total: 8
};

export const COLABORADOR_FICHA_MOCK: ColaboradorFicha = {
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
  rolLaboral: 'Desarrolladora frontend',
  emailCorporativo: 'lucia.fernandez@techforb.com',
  estado: 'ACTIVO',
  asignaciones: [
    {
      cliente: 'Banco del Plata',
      proyecto: 'Banca digital',
      rol: 'Desarrolladora frontend',
      inicio: '2021-03-15',
      fin: null
    },
    {
      cliente: 'Banco del Plata',
      proyecto: 'Portal clientes',
      rol: 'Desarrolladora frontend',
      inicio: '2022-11-01',
      fin: null
    }
  ],
  beneficios: ['Vacaciones 2026', 'Días off 2026'],
  documentos: ['CV actualizado.pdf', 'Contrato de ingreso.pdf'],
  evaluaciones: ['Trimestre 2024-1: Verde', 'Trimestre 2024-2: Amarillo'],
  bitacora: ['Reconocimiento por cliente 2023', 'Observación puntual 2024'],
  remuneraciones: ['Enero 2024', 'Febrero 2024'],
  bonos: ['Bono semestral 2024-01']
};
