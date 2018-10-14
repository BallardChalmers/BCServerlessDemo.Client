import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CacheBusterHttpInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.method === 'GET') {
            const customRequest = request.clone({
                headers: request.headers
                    .set('Cache-Control', 'no-cache')
                    .set('Pragma', 'no-cache')
            });
            return next.handle(customRequest);
        }

        return next.handle(request);
    }
}
