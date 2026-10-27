// Datos mock para el modo useMock (devuelve lo mismo que el backend dummy)

import { SesionResponse } from '../models/auth.models';

export const MOCK_SESSION: SesionResponse = {
  id: 'f0fac4c1-63b9-47cd-8e99-f87e019aac9f',
  nombre: 'RH ADMIN',
  email: 'rh@techforb.com',
  rol: 'ADMIN_RRHH',
  organizacionId: 'techforb-org-uuid'
};
