import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { MsalService } from './msal.service';

@Injectable()
export class AuthenticationHttpInterceptor implements HttpInterceptor {

    constructor(private authenticationService: MsalService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return Observable.fromPromise(this.authenticationService.getAuthenticationToken())
            .switchMap(token => {

                const user = this.authenticationService.getUser();
                const userId = !user ? null : user.displayableId;

                if (userId == null) {
                    req = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                } else {
                    req = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`,
                            UserId: userId
                        }
                    });
                }
                return next.handle(req);
            });
    }
}
