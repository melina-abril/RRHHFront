import { Observable } from 'rxjs';
import { mockError, mockResponse } from '../../../core/http/mock-response';
import { ProfessionalDocumentRequest, ProfessionalDocumentResponse, ProfessionalProfileRequest, ProfessionalProfileResponse } from '../models/professional-profile.models';

const profiles = new Map<string, ProfessionalProfileResponse>();

function findProfile(id: string): ProfessionalProfileResponse | null {
  if (!id.trim() || id === 'missing') return null;
  let profile = profiles.get(id);
  if (!profile) {
    profile = {
      employeeId: id,
      skills: ['Trabajo en equipo', 'Mentoría'],
      technologies: ['TypeScript', 'Node.js'],
      experienceYears: null,
      experienceDescription: '',
      certifications: [],
      documents: [],
    };
    profiles.set(id, profile);
  }
  return profile;
}

export function getProfessionalProfileMock(id: string): Observable<ProfessionalProfileResponse> {
  const profile = findProfile(id);
  return profile ? mockResponse({ ...profile, documents: [...profile.documents] }) : mockError(404, 'No se encontró el colaborador.');
}

export function updateProfessionalProfileMock(id: string, request: ProfessionalProfileRequest): Observable<ProfessionalProfileResponse> {
  const profile = findProfile(id);
  if (!profile) return mockError(404, 'No se encontró el colaborador.');
  if (request.experienceYears !== null && (request.experienceYears < 0 || request.experienceYears > 80)) {
    return mockError(422, 'Revisa los años de experiencia.', { experienceYears: ['Ingresa un valor entre 0 y 80.'] });
  }
  const updated: ProfessionalProfileResponse = { ...profile, ...request };
  profiles.set(id, updated);
  return mockResponse(updated);
}

export function addProfessionalDocumentMock(id: string, request: ProfessionalDocumentRequest): Observable<ProfessionalDocumentResponse> {
  const profile = findProfile(id);
  if (!profile) return mockError(404, 'No se encontró el colaborador.');
  if (!request.title.trim() || !request.category.trim()) {
    return mockError(422, 'Completa el título y la categoría.', { title: ['Ingresa un título.'], category: ['Ingresa una categoría.'] });
  }
  const document: ProfessionalDocumentResponse = {
    id: `doc-${Date.now()}`,
    title: request.title,
    category: request.category,
    description: request.description,
    fileName: request.fileName ?? null,
    contentType: request.contentType ?? null,
    contentBase64: request.contentBase64 ?? null,
    createdAt: new Date().toISOString(),
  };
  profiles.set(id, { ...profile, documents: [...profile.documents, document] });
  return mockResponse(document);
}
