import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // Agrega withCredentials: true a todas las requests (la sesión viaja en cookie HttpOnly)
  return next(req.clone({ withCredentials: true }));
};
