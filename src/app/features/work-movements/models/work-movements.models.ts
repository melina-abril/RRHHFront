import { Page } from 'src/app/shared/models/page';

export type WorkMovementType = 'CHANGE_CATEGORY' | 'EGRESS' | 'REENTRY' | 'ENTRY';

export interface WorkMovement {
  legajo: string;
  type: WorkMovementType;
  date: string; // ISO Date (yyyy-MM-dd)
  previousCategory: string | null;
  newCategory: string | null;
  previousStatus: string | null;
  newStatus: string | null;
  reason: string | null;
  performedBy: string;
  createdAt: string; // ISO datetime (yyyy-MM-ddTHH:mm:ss)
}

export interface ChangeCategoryRequest {
  newCategory: string;
  effectiveDate: string; // ISO Date (yyyy-MM-dd)
  reason: string;
}

export interface EgressRequest {
  effectiveDate: string; // ISO Date (yyyy-MM-dd)
  reason: string;
}

export interface ReentryRequest {
  reentryDate: string; // ISO Date (yyyy-MM-dd)
  newCategory: string;
  reason: string;
}
