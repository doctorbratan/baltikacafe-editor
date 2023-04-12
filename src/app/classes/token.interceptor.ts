import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {AuthService} from '../services/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    
    constructor( private auth: AuthService ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.auth.isAuthenticated()) {
            request = request.clone({
                setHeaders: {
                    Authorization: this.auth.getToken()
                }
            })
        }

        return next.handle(request).pipe(
            catchError(
                (error: HttpErrorResponse) => this.handleAuthError(error)
            )
        );
    }

    private handleAuthError(error: HttpErrorResponse): Observable<any> {
        if (error.status === 401) {
            this.auth.logout()
        }
        return throwError(error)
      }
}
