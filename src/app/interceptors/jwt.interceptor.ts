import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the token from localStorage or a service
    const token = localStorage.getItem('token'); // Adjust storage as needed
    
    // If token exists, clone the request and attach the token
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
    }

    return next.handle(request);
  }
}
