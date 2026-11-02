import { Routes } from '@angular/router';
import { roleGuard } from '../../core/session/role.guard';

export const PROJECT_ASSIGNMENTS_ROUTES: Routes = [
  { path: '', title: 'Clientes y proyectos', canMatch: [roleGuard('ADMIN')], loadComponent: () => import('./pages/catalog-page/catalog-page').then(m => m.CatalogPage) },
  { path: 'assignments', title: 'Asignaciones', canMatch: [roleGuard('ADMIN')], loadComponent: () => import('./pages/assignments-page/assignments-page').then(m => m.AssignmentsPage) },
  { path: 'assignments/:employeeId', title: 'Asignaciones del colaborador', canMatch: [roleGuard('ADMIN')], loadComponent: () => import('./pages/assignments-page/assignments-page').then(m => m.AssignmentsPage) },
  { path: 'assignments/:employeeId/new', title: 'Nueva asignación', canMatch: [roleGuard('ADMIN')], loadComponent: () => import('./pages/assignment-form-page/assignment-form-page').then(m => m.AssignmentFormPage) },
  { path: 'assignments/:employeeId/:id/edit', title: 'Editar asignación', canMatch: [roleGuard('ADMIN')], loadComponent: () => import('./pages/assignment-form-page/assignment-form-page').then(m => m.AssignmentFormPage) },
];
