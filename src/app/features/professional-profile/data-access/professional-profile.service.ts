import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { apiUrl } from '../../../core/http/api-url';
import { ProfessionalDocumentRequest, ProfessionalDocumentResponse, ProfessionalProfileRequest, ProfessionalProfileResponse } from '../models/professional-profile.models';
import { addProfessionalDocumentMock, getProfessionalProfileMock, updateProfessionalProfileMock } from './professional-profile.mock';

@Injectable({ providedIn: 'root' })
export class ProfessionalProfileService {
  private readonly http = inject(HttpClient);

  getProfessionalProfile(id: string): Observable<ProfessionalProfileResponse> {
    if (environment.useMock) return getProfessionalProfileMock(id);
    return this.http.get<ProfessionalProfileResponse>(apiUrl(`/api/professional-profiles/${encodeURIComponent(id)}`));
  }

  updateProfessionalProfile(id: string, request: ProfessionalProfileRequest): Observable<ProfessionalProfileResponse> {
    if (environment.useMock) return updateProfessionalProfileMock(id, request);
    return this.http.put<ProfessionalProfileResponse>(apiUrl(`/api/professional-profiles/${encodeURIComponent(id)}`), request);
  }

  addDocument(id: string, request: ProfessionalDocumentRequest): Observable<ProfessionalDocumentResponse> {
    if (environment.useMock) return addProfessionalDocumentMock(id, request);
    return this.http.post<ProfessionalDocumentResponse>(apiUrl(`/api/professional-profiles/${encodeURIComponent(id)}/documents`), request);
  }
}
