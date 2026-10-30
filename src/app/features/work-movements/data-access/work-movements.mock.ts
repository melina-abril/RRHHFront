import { WorkMovement } from '../models/work-movements.models';

export const workMovementsHistoryMock: WorkMovement[] = [
  {
    legajo: 'TFB-0042',
    type: 'REENTRY',
    date: '2025-02-10',
    previousCategory: 'Permanente',
    newCategory: 'Permanente',
    previousStatus: 'INACTIVE',
    newStatus: 'ACTIVE',
    reason: 'Nueva contratación',
    performedBy: 'Lucía Fernández',
    createdAt: '2025-02-10T09:34:00Z'
  },
  {
    legajo: 'TFB-0042',
    type: 'EGRESS',
    date: '2024-12-20',
    previousCategory: 'Permanente',
    newCategory: 'Permanente',
    previousStatus: 'ACTIVE',
    newStatus: 'INACTIVE',
    reason: 'Fin de contrato',
    performedBy: 'Lucía Fernández',
    createdAt: '2024-12-20T12:10:00Z'
  },
  {
    legajo: 'TFB-0042',
    type: 'REENTRY',
    date: '2023-08-07',
    previousCategory: 'Permanente',
    newCategory: 'Permanente',
    previousStatus: 'INACTIVE',
    newStatus: 'ACTIVE',
    reason: 'Regreso al equipo de calidad',
    performedBy: 'Lucía Fernández',
    createdAt: '2023-08-07T08:25:00Z'
  },
  {
    legajo: 'TFB-0042',
    type: 'EGRESS',
    date: '2022-06-30',
    previousCategory: 'Permanente',
    newCategory: 'Permanente',
    previousStatus: 'ACTIVE',
    newStatus: 'INACTIVE',
    reason: 'Finalización de proyecto',
    performedBy: 'Paula Ríos',
    createdAt: '2022-06-30T18:00:00Z'
  },
  {
    legajo: 'TFB-0042',
    type: 'CHANGE_CATEGORY',
    date: '2021-03-01',
    previousCategory: 'Pasante',
    newCategory: 'Permanente',
    previousStatus: 'ACTIVE',
    newStatus: 'ACTIVE',
    reason: 'Inicia antigüedad para beneficios de Permanente',
    performedBy: 'Paula Ríos',
    createdAt: '2021-03-01T11:15:00Z'
  },
  {
    legajo: 'TFB-0042',
    type: 'ENTRY',
    date: '2020-03-02',
    previousCategory: null,
    newCategory: 'Pasante',
    previousStatus: null,
    newStatus: 'ACTIVE',
    reason: 'Ingreso al equipo de calidad',
    performedBy: 'Paula Ríos',
    createdAt: '2020-03-02T10:00:00Z'
  }
];
