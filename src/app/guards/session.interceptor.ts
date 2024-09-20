import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()

export class SessionInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // do stuff with response if you want
                console.log('handle session')
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                console.log("Interceptor", err);
                if (err.status === 401) {
                    this.router.navigate(['login']);
                }
                else if (err.status === 0) {
                    this.router.navigate(['login']);
                }
            }
        }))

    }
}