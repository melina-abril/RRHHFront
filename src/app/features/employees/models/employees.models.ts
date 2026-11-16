export type EmployeeCategory = 'PERMANENT' | 'INTERN';
export type EmployeeDedication = 'FULL_TIME' | 'PART_TIME';
export type EmployeeWorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';

/** Campos de EmployeeResponse del backend. Las fechas son cadenas ISO. */
export interface EmployeeResponse {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  residenceCountry: string;
  personalEmail: string;
  startDate: string;
  category: EmployeeCategory;
  dedication: EmployeeDedication;
  workMode: EmployeeWorkMode;
  jobRole: string;
  status: EmployeeStatus;
  initialClient: string | null;
  initialProject: string | null;
  initialManager: string | null;
  createdAt: string;
}
