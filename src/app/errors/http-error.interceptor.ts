import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1),

      catchError((error: HttpErrorResponse) => {
        console.log(error);
        const errorMessage = Object.entries(error.error)
          .map(([key, val]) => {
            if (key === 'non_field_errors') {
              return (val as Array<string>).map((v) => `${v}\n`);
            }
            if (key === 'detail') return val;
            return `${key} : ${val}`;
          })
          .join('\n');
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
