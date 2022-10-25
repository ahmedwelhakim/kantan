import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) return next.handle(request);
        const modifiedReq = request.clone({
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer ' + user.accessToken
          ),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
