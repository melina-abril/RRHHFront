export interface ProfessionalProfileRequest {
  skills: string[];
  technologies: string[];
  experienceYears: number | null;
  experienceDescription: string;
  certifications: string[];
}

export type DocumentContentType = 'application/pdf' | 'image/png' | 'image/jpeg';

export interface ProfessionalDocumentRequest {
  title: string;
  category: string;
  description: string;
  fileName?: string;
  contentType?: DocumentContentType;
  contentBase64?: string;
}

export interface ProfessionalDocumentResponse {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string | null;
  contentType: DocumentContentType | null;
  contentBase64: string | null;
  createdAt: string;
}

export interface ProfessionalProfileResponse extends ProfessionalProfileRequest {
  employeeId: string;
  documents: ProfessionalDocumentResponse[];
}
