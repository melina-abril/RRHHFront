import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { firebaseAuth } from './firebase-auth';

/** Toda llamada a la API lleva el ID token de Firebase Auth (Authorization: Bearer …); el SDK lo renueva solo. */
export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  if (environment.useMock || !request.url.startsWith(environment.apiBaseUrl)) return next(request);
  const user = firebaseAuth().currentUser;
  if (!user) return next(request);
  return from(user.getIdToken()).pipe(
    switchMap((token) => next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
  );
};
